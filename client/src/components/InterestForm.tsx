import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { SelectedService } from "@shared/schema";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { leads, referral } from "@/lib/api";

interface InterestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedServices: SelectedService[];
  totalValue: number;
}

interface ReferralResponse {
  valid: boolean;
  discount: number;
  message: string;
}

const formSchema = z.object({
  telegram: z.string()
    .min(2, { message: "Telegram handle is required" })
    .startsWith('@', { message: "Telegram handle must start with @" }),
  message: z.string().optional(),
  referralCode: z.string().optional(),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to be contacted"
  })
});

type FormValues = z.infer<typeof formSchema>;

const InterestForm = ({ isOpen, onClose, onSuccess, selectedServices, totalValue }: InterestFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [referralCodeValid, setReferralCodeValid] = useState<boolean | null>(null);
  const [referralDiscount, setReferralDiscount] = useState<number>(0);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      telegram: '',
      message: '',
      referralCode: '',
      privacyConsent: false
    }
  });

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    if (!code) {
      setReferralCodeValid(null);
      setReferralDiscount(0);
      return;
    }

    try {
      console.log('Validating referral code:', code);
      const referralData = await referral.validateCode(code);
      console.log('Referral validation response:', referralData);
      
      if (!referralData) {
        setReferralCodeValid(false);
        setReferralDiscount(0);
        return;
      }
      
      const isValid = Boolean(referralData.valid);
      setReferralCodeValid(isValid);
      setReferralDiscount(isValid ? referralData.discount : 0);
      
      console.log('Updated referral state:', {
        isValid,
        discount: isValid ? referralData.discount : 0
      });
    } catch (error) {
      console.error('Error validating referral code:', error);
      setReferralCodeValid(false);
      setReferralDiscount(0);
    }
  };

  // Handle referral code change
  const handleReferralCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.trim().toUpperCase();
    console.log('Referral code changed:', code);
    
    form.setValue('referralCode', code);
    
    if (code !== '') {
      validateReferralCode(code);
    } else {
      setReferralCodeValid(null);
      setReferralDiscount(0);
    }
  };

  // Check for referral code in URL and validate on load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref')?.trim().toUpperCase();
    
    if (refCode) {
      console.log('Found referral code in URL:', refCode);
      form.setValue('referralCode', refCode);
      validateReferralCode(refCode);
    }
  }, [form]);

  // Calculate total with discount
  const finalTotal = referralDiscount > 0 ? totalValue - (totalValue * referralDiscount / 100) : totalValue;

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      // Verify referral code state
      console.log('Form submission - referral state:', {
        codeFromForm: data.referralCode,
        isValid: referralCodeValid,
        discount: referralDiscount
      });
      
      // Filter out TBD services from the total value calculation
      const nonTbdServices = selectedServices.filter(service => {
        if (typeof service.price === 'string') {
          const priceLower = service.price.toLowerCase();
          return !priceLower.includes('tbd') && !priceLower.includes('custom');
        }
        return typeof service.price === 'number';
      });

      // Calculate total and discount
      const subtotal = nonTbdServices.reduce((sum, service) => {
        if (typeof service.price === 'number') {
          return sum + service.price;
        }
        if (typeof service.price === 'string') {
          // Handle price ranges
          if (service.price.includes('-')) {
            const [min] = service.price.split('-');
            return sum + parseInt(min.replace(/\D/g, ''));
          }
          // Extract number for non-TBD prices
          const match = service.price.match(/\d+/);
          return match ? sum + parseInt(match[0]) : sum;
        }
        return sum;
      }, 0);

      // Only apply discount if referral code is valid
      const discountAmount = referralCodeValid === true ? Math.round(subtotal * referralDiscount / 100) : 0;

      // Ensure referral code is properly set
      const validReferralCode = referralCodeValid === true ? data.referralCode : null;
      
      // Log the data being sent
      const leadData = {
        telegram: data.telegram,
        message: data.message || undefined,
        referralCode: validReferralCode,
        selectedServices: selectedServices.map(service => ({
          category: service.category,
          name: service.name,
          price: service.price
        })),
        totalValue: subtotal,
        discountApplied: discountAmount
      };

      console.log('Sending lead data:', {
        ...leadData,
        referralCodeValid,
        referralDiscount,
        originalReferralCode: data.referralCode
      });

      const response = await leads.create(leadData);
      console.log('API Response:', response);

      form.reset();
      setReferralCodeValid(null);
      setReferralDiscount(0);
      onSuccess();
      
      toast({
        title: "Success",
        description: "Your interest has been submitted successfully!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error instanceof Error) {
        console.error('Error stack:', error.stack);
      }
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-dark-900 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Express Interest</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6">
            <FormField
              control={form.control}
              name="telegram"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-gray-300">
                    Telegram Handle <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="@yourusername"
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">Our advisor will contact you via Telegram</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-gray-300">
                    Referral Code <span className="text-gray-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter referral code"
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleReferralCodeChange(e);
                      }}
                    />
                  </FormControl>
                  
                  {referralCodeValid === true && (
                    <Alert className="mt-2 bg-green-900/20 text-green-400 border border-green-800">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        Valid code! You get {referralDiscount}% discount.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {referralCodeValid === false && (
                    <Alert className="mt-2 bg-red-900/20 text-red-400 border border-red-800">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                        {referralDiscount === 0 ? "Invalid referral code" : "Error validating referral code"}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="text-gray-300">
                    Message <span className="text-gray-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Any specific requirements or questions?"
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {referralDiscount > 0 && (
              <div className="mb-6 p-3 bg-dark-800 rounded-lg border border-primary/30">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Subtotal:</span>
                  <span className="text-white">${totalValue}</span>
                </div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-green-400">Discount ({referralDiscount}%):</span>
                  <span className="text-green-400">-${(totalValue * referralDiscount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base mt-2 pt-2 border-t border-gray-700">
                  <span className="font-medium text-white">Total:</span>
                  <span className="font-medium text-white">${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
            
            <FormField
              control={form.control}
              name="privacyConsent"
              render={({ field }) => (
                <FormItem className="flex items-center mb-6 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded bg-dark-800 border-gray-700 text-primary-600 focus:ring-primary-500 focus:ring-offset-dark-900"
                    />
                  </FormControl>
                  <FormLabel className="ml-2 text-sm text-gray-300 cursor-pointer">
                    I agree to be contacted about these services
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="px-4 py-2 bg-transparent border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition rounded-lg font-medium"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-primary hover:bg-primary-dark transition text-white rounded-lg font-medium"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default InterestForm;

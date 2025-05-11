import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface RequestServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const formSchema = z.object({
  telegram: z.string()
    .min(2, { message: "Telegram handle is required" })
    .startsWith('@', { message: "Telegram handle must start with @" }),
  requestedService: z.string()
    .min(3, { message: "Please describe the service you're looking for" }),
  privacyConsent: z.boolean().refine(val => val === true, {
    message: "You must agree to be contacted"
  })
});

type FormValues = z.infer<typeof formSchema>;

const RequestServiceModal = ({ isOpen, onClose, onSuccess }: RequestServiceModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      telegram: '',
      requestedService: '',
      privacyConsent: false
    }
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/service-requests', {
        telegram: data.telegram,
        requestedService: data.requestedService
      });

      setIsSubmitting(false);
      form.reset();
      onSuccess();
      toast({
        title: "Service request submitted",
        description: "We'll contact you on Telegram about your request soon!",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your request. Please try again.",
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-dark-900 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="p-6 border-b border-gray-800">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Request a Specific Service</h3>
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
              name="requestedService"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel className="text-gray-300">
                    Describe the Service You Need <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What specific marketing service are you looking for?"
                      className="w-full bg-dark-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="privacyConsent"
              render={({ field }) => (
                <FormItem className="flex items-center mb-6 space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="h-4 w-4 rounded bg-dark-800 border-gray-700 text-primary focus:ring-primary focus:ring-offset-dark-900"
                    />
                  </FormControl>
                  <FormLabel className="ml-2 text-sm text-gray-300 cursor-pointer">
                    I agree to be contacted about this service request
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
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RequestServiceModal;
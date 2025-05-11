import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SuccessModal = ({ isOpen, onClose }: SuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-dark-900 rounded-xl w-full max-w-md mx-4 overflow-hidden shadow-xl">
        <div className="p-8 text-center">
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-primary h-10 w-10" />
          </div>
          <h3 className="text-2xl font-semibold text-white mb-3">Thanks for Your Interest!</h3>
          <p className="text-gray-300 mb-6">
            An advisor will contact you on Telegram shortly to discuss your selected services.
          </p>
          <Button
            onClick={onClose}
            className="px-6 py-3 bg-primary hover:bg-primary-dark transition text-white rounded-lg font-medium"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;

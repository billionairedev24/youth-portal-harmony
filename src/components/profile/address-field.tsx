import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ProfileFormValues } from "./profile-form-schema";
import { useState, useCallback } from "react";
import { getMockAddressSuggestions } from "@/lib/mock-addresses";

interface AddressFieldProps {
  form: UseFormReturn<ProfileFormValues>;
}

export function AddressField({ form }: AddressFieldProps) {
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleAddressInput = useCallback((value: string, onChange: (...event: any[]) => void) => {
    onChange(value);
    const suggestions = getMockAddressSuggestions(value);
    setAddressSuggestions(suggestions);
    setShowSuggestions(suggestions.length > 0);
  }, []);

  const handleAddressSelect = useCallback((address: string, onChange: (...event: any[]) => void) => {
    onChange(address);
    setShowSuggestions(false);
  }, []);

  return (
    <FormField
      control={form.control}
      name="address"
      render={({ field }) => (
        <FormItem className="relative">
          <FormLabel>Address</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter your address" 
              {...field}
              onChange={(e) => handleAddressInput(e.target.value, field.onChange)}
              onFocus={() => setShowSuggestions(addressSuggestions.length > 0)}
            />
          </FormControl>
          {showSuggestions && (
            <div className="absolute w-full mt-1 bg-background border border-input rounded-md shadow-lg">
              {addressSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-accent"
                  onClick={() => handleAddressSelect(suggestion, field.onChange)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
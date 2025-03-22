
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Member, useMembersStore } from "@/stores/members-store";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const editMemberSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(5, "Phone number is too short"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type EditMemberFormValues = z.infer<typeof editMemberSchema>;

interface EditMemberDialogProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditMemberDialog({ member, open, onOpenChange }: EditMemberDialogProps) {
  const { updateMember } = useMembersStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditMemberFormValues>({
    resolver: zodResolver(editMemberSchema),
    defaultValues: {
      email: member?.email || "",
      phone: member?.phone || "",
      address: member?.address || "",
    },
  });

  // Update form values when member changes or dialog opens
  useEffect(() => {
    if (member && open) {
      form.reset({
        email: member.email,
        phone: member.phone,
        address: member.address,
      });
    }
  }, [member, open, form]);

  const onSubmit = (data: EditMemberFormValues) => {
    if (!member) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedMember = {
        ...member,
        email: data.email,
        phone: data.phone,
        address: data.address,
      };
      
      updateMember(member.id, updatedMember);
      
      toast.success("Member updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update member");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.image} alt={`${member.firstName} ${member.lastName}`} />
              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
            </Avatar>
            <span>Edit Member</span>
          </DialogTitle>
          <DialogDescription>
            Update {member.firstName} {member.lastName}'s contact information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Phone number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <Input value={member.firstName} disabled />
              </FormItem>
              
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <Input value={member.lastName} disabled />
              </FormItem>
            </div>
            
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <Input value={member.birthday} disabled />
            </FormItem>
            
            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

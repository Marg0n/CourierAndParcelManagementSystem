/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner"; 
import { useAuthStore } from "@/store/useAuthStore";

//* Validation schema using zod
const formSchema = z.object({
  customerEmail: z.string().email("Enter a valid email"),
  sensitiveParcelContent: z.boolean(),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  // dropOffLocation: z.string().min(3, "Drop-off location is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const BookParcel = () => {

  //* Form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerEmail: "",
      sensitiveParcelContent: false,
      pickupLocation: "",
      notes: "",
      // dropOffLocation: "",
    },
  });

  //* States
  const {user} = useAuthStore();
  const [loading, setLoading] = useState(false);

  async function onSubmit(values: FormValues) {
    setLoading(true);
    try {
      //! Example payload that matches your backend JSON structure
      const payload = {
        customerEmail: values?.customerEmail,
        sensitiveParcelContent: values?.sensitiveParcelContent,
        trackingHistory: [
          {
            status: "Parcel Booked",
            timestamp: new Date().toISOString(),
            location: { lat: 23.8103, lng: 90.4125 }, //? example coords
          },
        ],
        createdAt: new Date().toISOString(),
        notes: values?.notes,
      };

      //? send to backend (example)
      const res = await fetch("/api/parcels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to book parcel");

      toast("Success!", {
        description: "Parcel successfully booked.",
      });

      form.reset();
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong", {
        description: error.message || "Something went wrong",
        duration: 1000,
      });
    } finally {
      setLoading(false);
    }
  }

  // return (
  //   <>
  //     <h1 className="text-2xl font-bold text-gray-800">Book Parcels</h1>
  //     <p className="text-gray-600 mt-2">
  //       Manage Book parcels.
  //     </p>
  //   </>
  // );

  return (
    <div className="w-[90%] h-[80vh] mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-center text-sky-700">Book Parcels</h1>
      <p className="text-gray-600 text-center">
        Fill in the details below to book a parcel.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-center">Parcel Booking Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Customer Email */}
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input placeholder={user?.email || "tina@mail.com" }{...field} readOnly />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sensitive Contents */}
              <FormField
                control={form.control}
                name="sensitiveParcelContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sensitive Parcel Content</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        value={field.value ? "true" : "false"}
                        onChange={(e) => field.onChange(e.target.value === "true")}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Pickup Location */}
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Dhaka, Bangladesh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        placeholder="Add any delivery notes..."
                        className="w-full border rounded-md px-3 py-2 h-24"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Button */}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Book Parcel"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookParcel;

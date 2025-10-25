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
import { toast } from "sonner"; // optional if you use toast
import type { TUser } from "@/utils/types";

//* Validation schema using zod
const formSchema = z.object({
  customerEmail: z.string().email("Enter a valid email"),
  agentEmail: z.string().email("Enter a valid agent email"),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  dropoffLocation: z.string().min(3, "Drop-off location is required"),
});

const BookParcel = () => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerEmail: "",
      agentEmail: "",
      pickupLocation: "",
      dropoffLocation: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function onSubmit(values: Partial<TUser>) {
    setLoading(true);
    try {
      //! Example payload that matches your backend JSON structure
      const payload = {
        customerEmail: values.customerEmail,
        agentEmail: values.agentEmail,
        status: "Parcel Booked",
        trackingHistory: [
          {
            status: "Parcel Booked",
            timestamp: new Date().toISOString(),
            location: { lat: 23.8103, lng: 90.4125 }, //? example coords
          },
        ],
        currentLocation: { lat: 23.8103, lng: 90.4125 },
        createdAt: new Date().toISOString(),
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
    <div className="max-w-lg mx-auto mt-10">
      <h1 className="text-2xl font-bold text-gray-800">Book Parcels</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Fill in the details below to book a parcel.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Parcel Booking Form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Email</FormLabel>
                    <FormControl>
                      <Input placeholder="tina@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="agentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agent Email</FormLabel>
                    <FormControl>
                      <Input placeholder="hulk@mail.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="dropoffLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drop-off Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Rajshahi, Bangladesh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

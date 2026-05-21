import { AgentTrace, Booking, Provider, ExtractionResult } from "../types";

export interface GeneratedBookingResponse {
  messageText: string;
  booking: Booking | null;
  traces: Omit<AgentTrace, "traceId" | "timestamp">[];
}

export function generateBooking(
  topProvider: (Provider & { distance: number }) | null,
  params: ExtractionResult,
  language: "english" | "urdu" | "roman_urdu"
): GeneratedBookingResponse {
  const traces: Omit<AgentTrace, "traceId" | "timestamp">[] = [];
  
  traces.push({
    type: "thought",
    component: "BookingGenerator",
    content: "Formulating response message and booking summary based on top ranked provider and request details.",
    status: "success"
  });

  if (!topProvider) {
    let messageText = "I couldn't find any service providers matching your request at the moment. Please try adjusting your parameters.";
    if (language === "urdu") {
      messageText = "مجھے اس وقت آپ کی ضرورت کے مطابق کوئی بھی سروس فراہم کنندہ نہیں مل سکا۔ براہ کرم اپنی معلومات تبدیل کر کے دوبارہ کوشش کریں۔";
    } else if (language === "roman_urdu") {
      messageText = "Mujhe aapki request ke mutabiq koi provider nahi mil saka. Baraye meharbani details change kar ke check karain.";
    }

    traces.push({
      type: "result",
      component: "BookingGenerator",
      content: "No matching provider found. Generated failure notification.",
      status: "fallback"
    });

    return {
      messageText,
      booking: null,
      traces
    };
  }

  // Create mock booking details
  const bookingId = `b-${Date.now()}`;
  const scheduledTime = params.date ? `${params.date}T${params.timeSlot === "morning" ? "10:00:00" : params.timeSlot === "afternoon" ? "14:00:00" : params.timeSlot === "evening" ? "18:00:00" : "21:00:00"}` : new Date().toISOString();
  
  // Standard job estimated duration 1.5 hours
  const estimatedCost = topProvider.hourlyPrice * 1.5;

  const mockBooking: Booking = {
    id: bookingId,
    providerId: topProvider.id,
    userId: "u-current-user",
    status: "pending",
    scheduledTime,
    estimatedCost,
    serviceDetails: `${topProvider.category.toUpperCase()} service request in ${params.location || topProvider.city}`,
    location: {
      latitude: topProvider.coordinates.lat,
      longitude: topProvider.coordinates.lng,
      address: `${params.location || topProvider.city} Central Area`
    }
  };

  // Compile response text based on language
  let messageText = "";
  const formattedTime = new Date(scheduledTime).toLocaleString("en-US", { 
    weekday: "long", 
    month: "short", 
    day: "numeric", 
    hour: "numeric", 
    minute: "2-digit" 
  });

  if (language === "urdu") {
    messageText = `میں نے آپ کے لئے بہترین سروس فراہم کنندہ تلاش کر لیا ہے: **${topProvider.name}** جو کہ پلمبر ہیں اور آپ کی لوکیشن سے صرف ${topProvider.distance} کلومیٹر کے فاصلے پر دستیاب ہیں۔ ان کے چارجز **${topProvider.hourlyPrice} PKR فی گھنٹہ** ہیں۔ بکنگ کا تخمینہ **${estimatedCost} PKR** ہے جو کہ ${formattedTime} کے لئے شیڈول کی جا رہی ہے۔ کیا آپ اس بکنگ کی تصدیق کرنا چاہیں گے؟`;
  } else if (language === "roman_urdu") {
    messageText = `Maine aap ke liye best provider dhoond liya hai: **${topProvider.name}** (${topProvider.category}), jo aap se sirf ${topProvider.distance} km door hain. Inka rate **${topProvider.hourlyPrice} PKR per hour** hai. Estimated total cost **${estimatedCost} PKR** hogi. Hum isay **${formattedTime}** ke liye schedule kar rahay hain. Kya aap booking confirm karna chahtay hain?`;
  } else {
    messageText = `I have found the best match for you: **${topProvider.name}** (${topProvider.category}) is available just **${topProvider.distance} km** away from your location. Their rate is **PKR ${topProvider.hourlyPrice}/hr** with an estimated total of **PKR ${estimatedCost}** for the session scheduled on **${formattedTime}**. Would you like to confirm this booking?`;
  }

  traces.push({
    type: "result",
    component: "BookingGenerator",
    content: `Generated booking proposal (ID: ${bookingId}) with provider ${topProvider.name} (${topProvider.category}) for ${formattedTime}`,
    status: "success",
    metadata: { bookingId, providerId: topProvider.id, estimatedCost }
  });

  return {
    messageText,
    booking: mockBooking,
    traces
  };
}

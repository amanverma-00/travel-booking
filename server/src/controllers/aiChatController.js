import { GoogleGenerativeAI } from '@google/generative-ai';
import Listing from '../models/listing.js';

const buildSystemPrompt = (listing) => {
  const amenityList = listing.amenities?.join(', ') || 'Not specified';
  const price = listing.pricing?.basePrice
    ? `$${listing.pricing.basePrice}/night`
    : 'Price not specified';
  const cleaningFee = listing.pricing?.cleaningFee
    ? `$${listing.pricing.cleaningFee}`
    : 'None';
  const serviceFee = listing.pricing?.serviceFee
    ? `$${listing.pricing.serviceFee}`
    : 'None';

  const location = listing.location
    ? `${listing.location.address || ''}, ${listing.location.city || ''}, ${listing.location.state || ''}, ${listing.location.country || ''}`
    : 'Location not specified';

  const capacity = listing.capacity
    ? `${listing.capacity.maxGuests} guests, ${listing.capacity.bedrooms} bedrooms, ${listing.capacity.beds} beds, ${listing.capacity.bathrooms} bathrooms`
    : 'Not specified';

  const rules = listing.houseRules
    ? [
        `Check-in: ${listing.houseRules.checkIn || '15:00'}`,
        `Check-out: ${listing.houseRules.checkOut || '11:00'}`,
        `Smoking: ${listing.houseRules.smokingAllowed ? 'Allowed' : 'Not allowed'}`,
        `Pets: ${listing.houseRules.petsAllowed ? 'Allowed' : 'Not allowed'}`,
        `Events: ${listing.houseRules.eventsAllowed ? 'Allowed' : 'Not allowed'}`,
        `Instant Book: ${listing.houseRules.instantBook ? 'Yes' : 'No'}`,
      ].join(' | ')
    : 'Standard rules apply';

  const policies = listing.policies
    ? `Cancellation: ${listing.policies.cancellation} | Min stay: ${listing.policies.minimumStay} night(s) | Max stay: ${listing.policies.maximumStay} nights`
    : 'Standard policies';

  return `You are a friendly, knowledgeable AI concierge for the following property listed on Wanderlust, a travel booking platform.

=== PROPERTY DETAILS ===
Name: ${listing.title}
Type: ${listing.propertyType || 'Property'} (${listing.roomType || ''})
Description: ${listing.description}

=== LOCATION ===
${location}

=== CAPACITY ===
${capacity}

=== PRICING ===
Base price: ${price}
Cleaning fee: ${cleaningFee}
Service fee: ${serviceFee}
Weekly discount: ${listing.pricing?.weeklyDiscount || 0}%
Monthly discount: ${listing.pricing?.monthlyDiscount || 0}%

=== AMENITIES ===
${amenityList}

=== HOUSE RULES ===
${rules}

=== POLICIES ===
${policies}

=== RATINGS ===
Average rating: ${listing.ratingsAverage || 'New listing'} (${listing.ratingsQuantity || 0} reviews)

=== YOUR ROLE ===
You are the virtual concierge for this specific property. Answer guest questions helpfully, accurately, and in a warm, professional tone. 
- Only answer questions related to this property, travel tips for the area, or the booking process.
- If asked something outside this scope, politely redirect to booking or property topics.
- Keep responses concise but complete — 2-4 sentences unless more detail is truly needed.
- Never make up information not provided above. If something is unknown, say so honestly.
- Be enthusiastic about the property's genuine strengths.`;
};

/**
 * POST /api/ai/chat
 * Body: { listingId, message, history }
 */
export const chatWithListingAI = async (req, res) => {
  try {
    const { listingId, message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    if (!listingId) {
      return res.status(400).json({ success: false, error: 'listingId is required' });
    }

    // Check for API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(503).json({
        success: false,
        error: 'AI service not configured. Please set GEMINI_API_KEY in server/.env',
      });
    }

    // Fetch listing data
    let listing = null;
    if (listingId.match(/^[0-9a-fA-F]{24}$/)) {
      listing = await Listing.findById(listingId).lean();
    }

    if (!listing) {
      return res.status(404).json({ success: false, error: 'Listing not found' });
    }

    // Initialize AI client here so process.env is fully loaded by dotenv
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Build Gemini model with listing context as system instruction
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: buildSystemPrompt(listing),
    });

    // Convert history to Gemini format: [{role, parts}]
    let geminiHistory = history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Gemini API STRICTLY requires history to start with a user message
    if (geminiHistory.length > 0 && geminiHistory[0].role === 'model') {
      geminiHistory.shift();
    }

    // Start chat session
    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessage(message.trim());
    const responseText = result.response.text();

    res.json({
      success: true,
      message: responseText,
      listingId,
    });
  } catch (error) {
    console.error('AI Chat error:', error);

    // Friendly error for common issues
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      return res.status(401).json({
        success: false,
        error: 'Invalid Gemini API key. Please check your GEMINI_API_KEY in server/.env',
      });
    }

    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        success: false,
        error: 'AI service rate limit reached. Please try again in a moment.',
      });
    }

    res.status(500).json({
      success: false,
      error: `AI Error: ${error.message}`,
    });
  }
};

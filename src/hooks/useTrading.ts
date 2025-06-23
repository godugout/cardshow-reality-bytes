
// Re-export all trading hooks for backward compatibility
export { useTradeOffers } from './trading/useTradeOffers';
export { useTradeMessages } from './trading/useTradeMessages';
export { useTradeParticipants } from './trading/useTradeParticipants';
export { useCreateTradeOffer, useSendMessage, useUpdateTradeStatus } from './trading/useTradeMutations';
export { useTradePresence } from './trading/useTradePresence';

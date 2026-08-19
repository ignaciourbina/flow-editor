/**
 * @module lib/constants/api-node
 * @description Constants specific to the API node component: HTTP method colors and hexagon shape.
 *
 * @owner Team Alpha (Foundation)
 * @dependencies None (pure constants)
 */

/**
 * Maps HTTP method to a Tailwind badge color.
 * 
 * Color scheme follows RESTful semantic conventions:
 * - GET (read): green for safe operations
 * - POST (create): blue for new resources
 * - PUT (replace): amber for full updates
 * - PATCH (modify): orange for partial updates
 * - DELETE (remove): red for destructive operations
 */
export const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-green-200 text-green-800',
  POST: 'bg-blue-200 text-blue-800',
  PUT: 'bg-amber-200 text-amber-800',
  PATCH: 'bg-orange-200 text-orange-800',
  DELETE: 'bg-red-200 text-red-800',
} as const;

/**
 * CSS clip-path value for a flat-top hexagon.
 * 
 * Polygon points form a regular hexagon with flat top/bottom edges:
 * - Top edge: 25% → 75% width at 0% height
 * - Top-right angle: 100% width at 50% height
 * - Bottom-right angle: 75% width at 100% height
 * - Bottom edge: 75% → 25% width at 100% height
 * - Bottom-left angle: 0% width at 50% height
 * - Top-left angle: 25% width at 0% height
 * 
 * Applied via style={{ clipPath: HEXAGON_CLIP }} to create the distinctive API node shape.
 */
export const HEXAGON_CLIP = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' as const;

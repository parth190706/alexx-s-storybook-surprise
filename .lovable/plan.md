# Kriti aka Alexx — Interactive Birthday Story

## Experience
Build a single, mobile-first storybook experience at `/` with nine connected full-screen scenes: the opening, seven interactive chapters, and the finale. Progress is sequential, with gentle transitions, a compact chapter indicator, and a persistent music control after the opening tap.

## Visual direction
- Pastel cream, blush, lavender, dusk blue, strawberry red, and warm gold, expressed through reusable design tokens.
- Hand-painted storybook atmosphere made from layered CSS, Canvas particles, and custom SVG illustrations; no external image dependencies.
- Editorial serif titles paired with a handwritten accent and a clean readable body face.
- Soft paper texture, delicate shadows, restrained motion, and distinct environments for morning, twilight, midnight, and the final celebration.
- Responsive composition for narrow phones first, then tablets and desktop; safe-area aware and usable in portrait or landscape.

## Chapter interactions
1. **Opening — soft morning:** Stage “hey kriti aka alexx...” and the handwritten promise over drifting particles. “TAP TO START ✨” unlocks the audio engine and enters the story.
2. **The Sky is Full of Trouble:** Run a continuous balloon field. Pointer taps pop balloons with particles, varied notes, and short playful messages. A final marked balloon bursts into stars and reveals the “FIRST LITTLE THING” keepsake.
3. **One Perfect Shot:** Let the player grab the bowstring, pull in any pointer direction, and release. Render the drawn bow, string, trajectory, and flying arrow; score target collisions. A glowing bullseye unfolds a paper flower containing the supplied custom note.
4. **When the Clock Says Midnight:** Make both clock hands draggable around the face. Their angle drives the evening-to-night palette, moon height, window glow, stars, and fireflies. Reaching 12:00 plays a chime and unlocks “THE MIDNIGHT WISH.”
5. **The Wish Wheel:** Support swipe/drag spinning with velocity, friction, snap-to-segment physics, six named wishes, and clear spin counting. Spins one and two land on normal wishes; spin three resolves to “THE ONE I ACTUALLY WANTED YOU TO GET.”
6. **Ice Cream Emergency:** Use a requestAnimationFrame game loop for falling scoops and cones. Drag the bowl horizontally to catch them; catches bounce, sparkle, and fill the bowl. Completion drops a giant scoop and triggers a sprinkle celebration.
7. **Build Something Sweet:** Present sponge, cream, sponge, and frosting pieces as draggable layers that snap in order with tactile bounce and sound. Then unlock draggable strawberry, sprinkle, and cherry decorations.
8. **The Last Little Thing:** Drag candles onto the completed cake, tap each to light it, dim the room, then detect a horizontal swipe through the flames to blow them out with breeze particles and a floating star.
9. **For You, Alexx:** Recompose balloons, arrow stars, moonlight, wishes, sprinkles, and cake into a calm night celebration. Reveal the supplied final letter line by line, then finish with soft confetti, sparkles, and a warm glow.

## Sound
- Create a self-contained WebAudio engine only after the first user gesture.
- Synthesize a peaceful generative piano/pad/bell chord bed with conservative gain, gentle variation, and clean scheduling.
- Add lightweight procedural cues for pops, bow release, target hit, clock tick/chime, wheel clicks, catches, layer snaps, candle lighting, breeze, and finale.
- Music toggle updates immediately, handles suspended/resumed browser audio contexts, and never blocks progression if audio is unavailable.

## Interaction and resilience
- Use Pointer Events with pointer capture so the same code supports touch, pen, and mouse; prevent scrolling only while a gesture is active.
- Keep all targets comfortably touch-sized and offer short visible prompts plus non-drag fallback taps where needed.
- Pause animation work when scenes are inactive or the tab is hidden; cap particles and account for reduced-motion preferences.
- Keep progress in React state for the current visit, with guarded one-time completion events to prevent duplicate rewards or sounds.
- Add 5–6 discoverable secrets across the moon, stars, flower, wheel, cake fruit, and final floating star, each with a tiny visual/audio response.

## Technical structure
- Split the experience into a story controller, shared scene shell/progress controls, reusable pointer/particle helpers, a WebAudio provider, and one focused component per scene.
- Use SVG for manipulable illustrated objects and Canvas/CSS for ambient and burst particles.
- Add route-specific title, description, Open Graph, and Twitter metadata for the birthday experience; remove placeholder metadata.
- Keep all visual colors and typography in the global token system and use existing UI primitives where appropriate.

## Verification
- Exercise every chapter from start to finish with automated pointer interactions at desktop and narrow mobile sizes.
- Verify bow hits, clock midnight detection, exactly three wheel outcomes, bowl catches, ordered cake snapping, candle lighting/blowing, audio toggle state, chapter transitions, and Easter eggs.
- Check screenshots for clipping, overlap, readable text, safe-area spacing, and the complete final letter.
- Confirm no runtime console errors and that reduced-motion and audio-unavailable paths still allow completion.

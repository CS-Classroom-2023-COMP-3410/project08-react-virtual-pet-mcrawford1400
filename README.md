[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/C8pZTYwA)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=19533564&assignment_repo_type=AssignmentRepo)
# React Virtual Pet
---

**Objective**:

Create an interactive React application where users care for a virtual pet represented by emojis. The pet's appearance changes based on its status, and users can interact with it through various actions. This project will help you build a working application from scratch using React.

---

**Requirements**:

1. **Pet Visualization**:
   - Represent the pet using appropriate emojis that change based on the pet's current state
   - Display different emojis for various pet states (happy, hungry, tired, sick, dirty, sleeping)
   - Show visual changes as the pet grows from baby to adult stages (egg → chick → teen bird → adult bird)
   - The pet should visually react to user interactions (show eating animation when fed, etc.)

2. **Pet Status Management**:
   - Track at least 5 different status metrics (hunger, energy, happiness, health, cleanliness)
   - Each stat should decay over time at different rates when the pet is idle
   - Display rounded integer values for stats to avoid floating-point display issues
   - Stats should decay relatively quickly (noticeable changes within 1-2 minutes) to keep the game engaging
   - The pet's mood should be determined by the combination of its stats

3. **User Interactions**:
   - Implement at least 4 distinct interactions (feed, play, clean, sleep)
   - Each interaction should affect multiple stats simultaneously (e.g., playing increases happiness but decreases energy)
   - Interactions should be unavailable in certain states (e.g., can't feed a sleeping pet)
   - Each interaction should have a visual indication (using emojis) and last for a short duration

4. **Time and Aging System**:
   - Implement a virtual day/aging system where one real-world minute equals one "pet day"
   - Calculate and apply stat changes based on elapsed time when the user returns after closing the app
   - Pet should progress through growth stages based on age (baby at 0-5 days, child at 6-10 days, etc.)
   - Display the pet's age prominently in the UI

5. **Achievements**:
   - Create at least 8 different achievements that unlock based on pet care milestones
   - Display notifications when new achievements are unlocked
   - Show a list of locked and unlocked achievements with descriptions
   - Store achievement progress in localStorage

6. **Data Persistence**:
   - Save the entire pet state to `localStorage` after each significant change
   - Load saved data when the app starts
   - Handle the first-time experience when no saved data exists
   - Correctly calculate time passed when the user returns to the app

7. **Responsive Design**:
   - Ensure the application works well on both mobile and desktop screens
   - Create an intuitive and visually appealing interface
   - Use appropriate color coding for status bars to indicate good/bad values

---

**Technical Implementation Details**:

1. **Project Structure**:
   - Organize code into logical directories (`components`, `hooks`, `utils`)
   - Create reusable components for repeated UI elements (status bars, buttons)
   - Separate business logic from presentation using custom hooks

2. **Custom Hooks Implementation**:
   - `usePet.js`: Main hook that manages pet state and interactions
   - `useTimePassage.js`: Logic for time-based effects and stat decay
   - `useLocalStorage.js`: Persistence to localStorage
   - `useAchievements.js`: Achievement tracking and unlocking

3. **Key State Management**:
   - The pet state should include:
     - Stats (hunger, energy, happiness, health, cleanliness, bond)
     - Current activity (eating, playing, cleaning, sleeping, or null)
     - Growth stage (baby, child, teen, adult)
     - Birth date (for age calculation)
     - Last interaction timestamp
     - Last visited timestamp

4. **Time Handling**:
   - Use `setInterval` to update the UI and apply stat decay at regular intervals
   - Calculate elapsed time between sessions using timestamp comparison
   - Clean up intervals with the useEffect cleanup function to prevent memory leaks

5. **User Experience Considerations**:
   - Provide clear visual feedback for all interactions
   - Disable unavailable actions rather than hiding them
   - Show notifications for important events (achievements, growth stage changes)
   - Use animation or transitions for smoother user experience

---

**Implementation Hints**:

1. **Managing Pet Stats**:
   - Keep pet stats in a single object in state for easier updates:
   ```javascript
   const [petStats, setPetStats] = useState({
     hunger: 80,
     energy: 75,
     happiness: 90,
     health: 85,
     cleanliness: 70,
     age: 0,
     bond: 50
   });
   ```

2. **Custom Hook Structure**:
   - When creating a custom hook, make sure to return all the necessary values and functions:
   ```javascript
   function usePet() {
     // State and logic implementation...
     
     return {
       petState,
       mood,
       achievements,
       notification,
       feedPet,
       playWithPet,
       cleanPet,
       toggleSleep
     };
   }
   ```

3. **Handling Time Passage**:
   - Use the current timestamp for accurate time calculations:
   ```javascript
   function minutesElapsedSince(timestamp) {
     const now = Date.now();
     const elapsed = now - timestamp;
     return elapsed / (1000 * 60); // Convert ms to minutes
   }
   ```
   
4. **Setting Up Intervals**:
   - Make sure to clean up intervals to prevent memory leaks:
   ```javascript
   useEffect(() => {
     const interval = setInterval(() => {
       // Update logic here
     }, 30000); // Every 30 seconds
     
     return () => clearInterval(interval); // Cleanup
   }, []);
   ```

5. **Activity Animation**:
   - Use setTimeout to reset activities after a duration:
   ```javascript
   function feedPet() {
     setPetState(prev => ({
       ...prev,
       activity: 'eating',
       // Update stats...
     }));
     
     setTimeout(() => {
       setPetState(prev => ({
         ...prev,
         activity: null
       }));
     }, 3000); // Activity lasts 3 seconds
   }
   ```

6. **Fixing Floating-Point Display**:
   - Round numbers for display without changing the underlying values:
   ```javascript
   // In the StatusBar component
   const displayValue = Math.round(value);
   ```

7. **Accelerated Aging**:
   - Convert minutes to "pet days":
   ```javascript
   export function calculateAge(birthdate) {
     const now = Date.now();
     const elapsed = now - birthdate;
     return Math.floor(elapsed / (1000 * 60)); // 1 minute = 1 day
   }
   ```

8. **Handling Growth Stages**:
   - Set appropriate thresholds for a reasonable progression:
   ```javascript
   export const GROWTH_STAGES = {
     baby: { min: 0, max: 5, emoji: '🥚' },   // First 5 minutes
     child: { min: 6, max: 10, emoji: '🐣' },  // Next 5 minutes
     teen: { min: 11, max: 20, emoji: '🐥' },  // Next 10 minutes
     adult: { min: 21, max: Infinity, emoji: '🐤' } // After 20 minutes
   };
   ```

9. **Responsive Design Tip**:
    - Use CSS Grid or Flexbox for layout:
    ```css
    .action-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    @media (max-width: 600px) {
      .action-buttons {
        grid-template-columns: 1fr; /* Stack on small screens */
      }
    }
    ```

10. **Common Pitfalls to Avoid**:
    - Forgetting to update timestamps when interactions occur
    - Not handling the initial state for new users
    - Over-complicating the state management
    - Not cleaning up side effects like intervals and timeouts
    - Trying to update state directly instead of using the setState function

---

**Expected Behavior**:

When implemented correctly, your virtual pet application should:

1. **Startup**: 
   - Load any existing pet data from localStorage
   - Start with default values for a new pet if no data exists
   - Begin the stat decay timers immediately

2. **Idle Behavior**:
   - Stats should visibly decay over time (roughly 3-5 points per minute)
   - The pet's mood should change based on its lowest stats
   - The pet's age should increase by 1 "day" every minute
   - The growth stage should update automatically when age thresholds are reached

3. **Interactions**:
   - Feeding should significantly increase hunger (around 20 points) and slightly boost energy
   - Playing should greatly increase happiness but drain energy and increase hunger
   - Cleaning should maximize cleanliness but temporarily decrease happiness
   - Sleep should gradually restore energy while the pet remains in sleep mode

4. **Time Passage**:
   - If the user closes the app and returns later, the pet's stats should have decreased appropriately
   - A pet left alone for many hours may have multiple stats at zero and be in poor health
   - The pet should age appropriately for the time passed

5. **Growth & Achievements**:
   - The pet should visually change as it ages through different growth stages
   - Achievements should unlock when specific conditions are met
   - Notifications should display when new achievements are unlocked

---

**Bonus Features**:

1. **Pet Personality**: Implement random personality traits that affect how the pet responds to different interactions
2. **Mini Games**: Create simple mini-games to play with the pet that have different effects on stats
3. **Customization**: Allow users to name their pet and choose from different pet types at the start
4. **Statistics Tracking**: Record and display stats about interactions, time spent caring for the pet, etc.
5. **Day/Night Cycle**: Implement a day/night cycle that affects the pet's behavior and stat decay rates

---

**Submission Requirements**:

- Commit and push to your GitHub Classroom repository containing your complete project
- Include NOTES.md explaining:
  - How to install and run the application
  - Features implemented
  - Any bonus features you added
  - Screenshots of the pet in different states
- Ensure your application is fully functional when installed with `npm install` and run with `npm run dev`

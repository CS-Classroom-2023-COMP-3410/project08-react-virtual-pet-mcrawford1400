//importing core react features and components
import React, { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import ActionButton from './components/ActionButton';
import './App.css';

// Defining the achievements and their conditions
const ALL_ACHIEVEMENTS = [
  { id: 'feed1', description: 'First Meal', condition: stats => stats.hunger >= 90 },
  { id: 'play1', description: 'First Playtime', condition: stats => stats.happiness >= 95 },
  { id: 'clean1', description: 'Sparkly Clean', condition: stats => stats.cleanliness === 100 },
  { id: 'healthy', description: 'Top Health', condition: stats => stats.health >= 90 },
  { id: 'energized', description: 'Fully Rested', condition: stats => stats.energy === 100 },
  {
    id: 'careful',
    description: 'All Stats Over 80',
    condition: stats => Object.values(stats).every(v => v >= 80)
  },
  { id: 'survivor5', description: 'Survived 5 Days', condition: (_, age) => age >= 5 },
  { id: 'survivor10', description: 'Survived 10 Days', condition: (_, age) => age >= 10 }
];
//load initial stats and birthdate from localstorage
const getInitialStats = () => {
  const saved = localStorage.getItem('petStats');
  return saved
    ? JSON.parse(saved)
    : {
        hunger: 80,
        energy: 65,
        happiness: 90,
        health: 75,
        cleanliness: 60
      };
};

const getInitialBirthDate = () => {
  const saved = localStorage.getItem('birthDate');
  return saved ? parseInt(saved) : Date.now();
};

function App() {
  //react state
  const [stats, setStats] = useState(getInitialStats);
  const [birthDate] = useState(getInitialBirthDate);
  const [isSleeping, setIsSleeping] = useState(false);
  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    const saved = localStorage.getItem('achievements');
    return saved ? JSON.parse(saved) : [];
  });
  const [notification, setNotification] = useState(null);

  // calculate pet's age in virtual days
  // 1 virtual day = 24 hours = 1440 minutes
  const age = Math.floor((Date.now() - birthDate) / (1000 * 60));


  //defining growth stages 
  const GROWTH_STAGES = {
    baby: { min: 0, max: 5 },
    child: { min: 6, max: 10},
    teen: { min: 11, max: 20},
    adult: { min: 21, max: Infinity}
  };

  const getGrowthStage = (age) => {
    return Object.entries(GROWTH_STAGES).find(
      ([, range]) => age >= range.min && age <= range.max
    );
  };

  const [growthLabel, growthData] = getGrowthStage(age);
//decay states evry 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        if (isSleeping) {
          return {
            ...prev,//spread operatpr to copy all properties
            energy: Math.min(prev.energy + 2, 100)
          };
        }
        return {
          hunger: Math.max(prev.hunger - 1, 0),
          energy: Math.max(prev.energy - 1, 0),
          happiness: Math.max(prev.happiness - 1, 0),
          health: Math.max(prev.health - 1, 0),
          cleanliness: Math.max(prev.cleanliness - 1, 0)
        };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [isSleeping]);

  //save stats and birthdate to localstorage
  useEffect(() => {
    localStorage.setItem('petStats', JSON.stringify(stats));
    localStorage.setItem('birthDate', birthDate.toString());
  }, [stats, birthDate]);

  //unlock achievements based on conditions
  useEffect(() => {
    const newlyUnlocked = ALL_ACHIEVEMENTS.filter(
      ach => !unlockedAchievements.includes(ach.id) && ach.condition(stats, age)
    ).map(ach => ach.id);

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked]);

      const justUnlocked = ALL_ACHIEVEMENTS.find(ach => ach.id === newlyUnlocked[0]);
      setNotification(`🏆 Achievement Unlocked: ${justUnlocked.description}!`);

      setTimeout(() => setNotification(null), 3000);
    }
  }, [stats, age]);

  //persist unlocked achievements to localstorage

  useEffect(() => {
    localStorage.setItem('achievements', JSON.stringify(unlockedAchievements));
  }, [unlockedAchievements]);

  //action handlers for pet interactions
  const feedPet = () => {
    setStats(prev => ({
      ...prev,
      hunger: Math.min(prev.hunger + 20, 100),
      energy: Math.min(prev.energy + 5, 100)
    }));
  };

  const playWithPet = () => {
    setStats(prev => ({
      ...prev,
      happiness: Math.min(prev.happiness + 15, 100),
      energy: Math.max(prev.energy - 10, 0),
      hunger: Math.max(prev.hunger - 5, 0)
    }));
  };

  const cleanPet = () => {
    setStats(prev => ({
      ...prev, 
      cleanliness: 100,
      happiness: Math.max(prev.happiness - 5, 0)
    }));
  };

  const toggleSleep = () => {
    setIsSleeping(prev => !prev);
  };


  //render the main UI
  return (
    <div className="App">
      <h1>Virtual Pet</h1>
      <p>Your virtual pet</p>

      <h2>
        {growthData.emoji} Age: {age} day{age !== 1 ? 's' : ''} ({growthLabel})
      </h2>

      {Object.entries(stats).map(([key, value]) => (
        <StatusBar key={key} label={key} value={value} />
      ))}

      <div style={{marginTop: '20px' }}>
        <ActionButton label="Feed" onClick={feedPet} disabled={isSleeping} />
        <ActionButton label="Play" onClick={playWithPet} disabled={isSleeping} />
        <ActionButton label="Clean" onClick={cleanPet} disabled={isSleeping} />
        <ActionButton label={isSleeping ? 'Wake Up' : 'Sleep'} onClick={toggleSleep} />
      </div>

      {notification && (
        <div style={{ marginTop: '20px', fontWeight: 'bold', color: 'gold' }}>
          {notification}
        </div>
      )}

      <div style={{ marginTop: '40px' }}>
        <h2>Achievements</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {ALL_ACHIEVEMENTS.map(ach => (
            <li key={ach.id} style={{ marginBottom: '8px' }}>
              {unlockedAchievements.includes(ach.id) ? '✅' : '🔒'} {ach.description}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

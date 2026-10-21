const $ = (id) => document.getElementById(id);
const form = $("gameForm");
const gameList = $("gameList");
const workoutForm = $("workoutForm");
const workoutList = $("workoutList");
const pointsGoalInput = $("pointsGoal");
let games = JSON.parse(localStorage.getItem("hoopTrackerGames") || "[]");
let workouts = JSON.parse(localStorage.getItem("hoopTrackerWorkouts") || "[]");
if (pointsGoalInput) {
   pointsGoalInput.value = localStorage.getItem("hoopTrackerPointsGoal") || "30";
}
const ATTRIBUTE_GROUPS = [
   {
       id: "shooting",
       name: "Shooting",
       attributes: [
           ["midRange", "Mid-Range"],
           ["threePoint", "Three-Point"],
           ["freeThrow", "Free Throw"],
           ["closeShot", "Close Shot"],
           ["pullUp", "Pull-Up Shooting"],
           ["catchShoot", "Catch & Shoot"]
       ]
   },
   {
       id: "handling",
       name: "Ball Handling",
       attributes: [
           ["ballControl", "Ball Control"],
           ["dribbleSpeed", "Dribble Speed"],
           ["weakHand", "Weak Hand"],
           ["crossover", "Crossover"],
           ["betweenLegs", "Between the Legs"],
           ["behindBack", "Behind the Back"],
           ["comboMoves", "Combo Moves"],
           ["speedWithBall", "Speed With Ball"]
       ]
   },
   {
       id: "finishing",
       name: "Finishing",
       attributes: [
           ["drivingLayup", "Driving Layup"],
           ["leftLayup", "Left-Hand Layup"],
           ["rightLayup", "Right-Hand Layup"],
           ["floater", "Floater"],
           ["euroStep", "Euro Step"],
           ["reverseLayup", "Reverse Layup"],
           ["contactFinishing", "Contact Finishing"],
           ["dunking", "Dunking"]
       ]
   },
   {
       id: "playmaking",
       name: "Playmaking",
       attributes: [
           ["passAccuracy", "Pass Accuracy"],
           ["passingSpeed", "Passing Speed"],
           ["courtVision", "Court Vision"],
           ["decisionMaking", "Decision Making"],
           ["passingPressure", "Passing Under Pressure"],
           ["pickRoll", "Pick & Roll"]
       ]
   },
   {
       id: "athleticism",
       name: "Athleticism",
       attributes: [
           ["sprintSpeed", "Sprint Speed"],
           ["acceleration", "Acceleration"],
           ["verticalJump", "Vertical Jump"],
           ["agility", "Agility"],
           ["stamina", "Stamina"],
           ["strength", "Strength"],
           ["balance", "Balance"],
           ["reactionTime", "Reaction Time"]
       ]
   },
   {
       id: "defense",
       name: "Defense",
       attributes: [
           ["perimeterDefense", "Perimeter Defense"],
           ["lateralQuickness", "Lateral Quickness"],
           ["steal", "Steal"],
           ["defensiveFootwork", "Defensive Footwork"],
           ["shotContest", "Shot Contest"],
           ["defensiveAwareness", "Defensive Awareness"],
           ["rebounding", "Rebounding"],
           ["onBallDefense", "On-Ball Defense"]
       ]
   }
];
const allAttributes = ATTRIBUTE_GROUPS.flatMap(group =>
   group.attributes.map(([id, name]) => ({
       id,
       name,
       group: group.id
   }))
);
const savedAttributes = JSON.parse(
   localStorage.getItem("hoopTrackerAttributes") || "{}"
);
const attributes = Object.fromEntries(
   allAttributes.map(attribute => [
attribute.id,
       Math.max(
           60,
           Math.min(99, Number(savedAttributes[attribute.id]) || 60)
       )
   ])
);
let playerProfile = JSON.parse(
   localStorage.getItem("hoopTrackerPlayer") ||
   '{"name":"","position":"PG"}'
);
let completedChallenges = JSON.parse(
   localStorage.getItem("hoopTrackerCompletedChallenges") || "[]"
);
// Existing challenge IDs are preserved so saved completion data still works.
const LEGACY_CHALLENGES = [
   {
       id: "shoot-ft-bronze",
       category: "shooting",
       attribute: "freeThrow",
       title: "Free Throw Consistency",
       difficulty: "Bronze",
       description: "Make 6 free throws out of 10 attempts.",
       reward: 1
   },
   {
       id: "shoot-mid-bronze",
       category: "shooting",
       attribute: "midRange",
       title: "Mid-Range Accuracy",
       difficulty: "Bronze",
       description: "Make 6 mid-range shots out of 10 attempts.",
       reward: 1
   },
   {
       id: "shoot-three-bronze",
       category: "shooting",
       attribute: "threePoint",
       title: "Three-Point Starter",
       difficulty: "Bronze",
       description: "Make 5 three-pointers out of 15 attempts.",
       reward: 1
   },
   {
       id: "shoot-close-bronze",
       category: "shooting",
       attribute: "closeShot",
       title: "Close Shot Control",
       difficulty: "Bronze",
       description: "Make 8 close-range shots out of 10 attempts.",
       reward: 1
   },
   {
       id: "shoot-pullup-silver",
       category: "shooting",
       attribute: "pullUp",
       title: "Pull-Up Challenge",
       difficulty: "Silver",
       description: "Make 6 pull-up mid-range shots out of 10 attempts.",
       reward: 1
   },
   {
       id: "shoot-catch-silver",
       category: "shooting",
       attribute: "catchShoot",
       title: "Catch & Shoot",
       difficulty: "Silver",
       description: "Make 7 catch-and-shoot shots out of 10 attempts.",
       reward: 1
   },
   {
       id: "shooting-gold",
       category: "shooting",
       attribute: "threePoint",
       title: "Gold: Sharpshooter",
       difficulty: "Gold",
       description: "Make 10 three-pointers out of 15 attempts from at least 5 different spots.",
       reward: 2
   },
   {
       id: "shooting-gold-midrange",
       category: "shooting",
       attribute: "midRange",
       title: "Gold: Mid-Range Specialist",
       difficulty: "Gold",
       description: "Make 8 mid-range shots out of 10 attempts from at least 3 different spots.",
       reward: 2
   },
   {
       id: "shooting-gold-free-throw",
       category: "shooting",
       attribute: "freeThrow",
       title: "Gold: Ice in the Veins",
       difficulty: "Gold",
       description: "Make 9 free throws in a row out of 10 attempts.",
       reward: 2
   },
   {
       id: "handle-control-bronze",
       category: "handling",
       attribute: "ballControl",
       title: "Ball Control Basics",
       difficulty: "Bronze",
       description: "Dribble continuously for 30 seconds without losing control of the ball.",
       reward: 1
   },
   {
       id: "handle-weak-bronze",
       category: "handling",
       attribute: "weakHand",
       title: "Weak Hand",
       difficulty: "Bronze",
       description: "Complete 30 controlled dribbles with your weaker hand.",
       reward: 1
   },
   {
       id: "handle-crossover-bronze",
       category: "handling",
       attribute: "crossover",
       title: "Crossover Control",
       difficulty: "Bronze",
       description: "Complete 30 controlled crossover dribbles.",
       reward: 1
   },
   {
       id: "handle-between-silver",
       category: "handling",
       attribute: "betweenLegs",
       title: "Between-the-Legs",
       difficulty: "Silver",
       description: "Complete 20 consecutive clean between-the-legs dribbles.",
       reward: 1
   },
   {
       id: "handle-behind-silver",
       category: "handling",
       attribute: "behindBack",
       title: "Behind-the-Back",
       difficulty: "Silver",
       description: "Complete 15 controlled behind-the-back dribbles.",
       reward: 1
   },
   {
       id: "handling-gold-combo",
       category: "handling",
       attribute: "comboMoves",
       title: "Gold: Combo Creator",
       difficulty: "Gold",
       description: "Perform 5 different dribble combinations in a row without losing the ball, then finish with a shot.",
       reward: 2
   },
   {
       id: "handling-gold-weak-hand",
       category: "handling",
       attribute: "weakHand",
       title: "Gold: Weak-Hand Master",
       difficulty: "Gold",
       description: "Dribble with your weaker hand for 60 seconds, then make 10 successful weak-hand finishes.",
       reward: 2
   },
   {
       id: "finish-right-bronze",
       category: "finishing",
       attribute: "rightLayup",
       title: "Right-Hand Finishing",
       difficulty: "Bronze",
       description: "Make 8 right-handed layups out of 10 attempts.",
       reward: 1
   },
   {
       id: "finish-left-bronze",
       category: "finishing",
       attribute: "leftLayup",
       title: "Left-Hand Finishing",
       difficulty: "Bronze",
       description: "Make 7 left-handed layups out of 10 attempts.",
       reward: 1
   },
   {
       id: "finish-floater-silver",
       category: "finishing",
       attribute: "floater",
       title: "Floater Touch",
       difficulty: "Silver",
       description: "Make 6 floaters out of 10 attempts from both sides.",
       reward: 1
   },
   {
       id: "finishing-gold",
       category: "finishing",
       attribute: "drivingLayup",
       title: "Gold: Finishing Package",
       difficulty: "Gold",
       description: "Make 8 layups out of 10 attempts using right-handed, left-handed, and reverse finishes.",
       reward: 2
   },
   {
       id: "finishing-gold-floater",
       category: "finishing",
       attribute: "floater",
       title: "Gold: Floater Specialist",
       difficulty: "Gold",
       description: "Make 8 floaters out of 10 attempts from both sides of the court.",
       reward: 2
   },
   {
       id: "play-pass-bronze",
       category: "playmaking",
       attribute: "passAccuracy",
       title: "Passing Accuracy",
       difficulty: "Bronze",
       description: "Hit a designated target area with 8 out of 10 passes.",
       reward: 1
   },
   {
       id: "play-vision-silver",
       category: "playmaking",
       attribute: "courtVision",
       title: "Court Vision",
       difficulty: "Silver",
       description: "Complete 10 passing drills with a training partner that require good decisions.",
       reward: 1
   },
   {
       id: "playmaking-gold",
       category: "playmaking",
       attribute: "decisionMaking",
       title: "Gold: Floor General",
       difficulty: "Gold",
       description: "Complete 10 game-situation drills with a training partner, choosing the correct pass or finish at least 8 times.",
       reward: 2
   },
   {
       id: "athletic-agility-bronze",
       category: "athleticism",
       attribute: "agility",
       title: "Agility Test",
       difficulty: "Bronze",
       description: "Record your time in a proper shuttle run, then repeat it on the same course.",
       reward: 1
   },
   {
       id: "athletic-jump-bronze",
       category: "athleticism",
       attribute: "verticalJump",
       title: "Vertical Jump Baseline",
       difficulty: "Bronze",
       description: "Measure three proper jumps and record your best result.",
       reward: 1
   },
   {
       id: "athleticism-gold",
       category: "athleticism",
       attribute: "stamina",
       title: "Gold: Fourth-Quarter Engine",
       difficulty: "Gold",
       description: "Complete 4 intense 2-minute conditioning rounds with 1 minute of rest between rounds. Stop if you feel pain.",
       reward: 2
   },
   {
       id: "defense-footwork-bronze",
       category: "defense",
       attribute: "defensiveFootwork",
       title: "Defensive Footwork",
       difficulty: "Bronze",
       description: "Complete 3 × 20 seconds of lateral defensive footwork.",
       reward: 1
   },
   {
       id: "defense-rebound-silver",
       category: "defense",
       attribute: "rebounding",
       title: "Rebound Positioning",
       difficulty: "Silver",
       description: "Complete 8 proper rebounding-positioning repetitions out of 10 with a training partner.",
       reward: 1
   },
   {
       id: "defense-gold",
       category: "defense",
       attribute: "perimeterDefense",
       title: "Gold: Lockdown Defender",
       difficulty: "Gold",
       description: "Complete 10 one-on-one defensive repetitions with a training partner, staying in front of the attacker without fouling at least 7 times.",
       reward: 2
   }
];
// Generate progressive challenges for every attribute.
const GENERATED_CHALLENGES = allAttributes.flatMap(attribute => {
   const tiers = [
       { difficulty: "Bronze", count: 8, reward: 1 },
       { difficulty: "Silver", count: 6, reward: 2 },
       { difficulty: "Gold", count: 4, reward: 3 },
       { difficulty: "Elite", count: 3, reward: 3 }
   ];
   const challenges = [];
   let progression = 0;
   tiers.forEach(tier => {
       for (let i = 1; i <= tier.count; i++) {
           progression++;
           const repetitions = 10 + progression * 2;
           const seconds = 20 + progression * 5;
           let description;
           switch (attribute.group) {
               case "shooting":
                   description =
                       `Practice ${attribute.name} shots. Take ${repetitions} attempts ` +
                       `and record how many you make.`;
                   break;
               case "handling":
                   description =
                       `Improve your ${attribute.name}. Practice with focus for ` +
                       `${seconds} seconds, maintaining controlled dribbling.`;
                   break;
               case "finishing":
                   description =
                       `Practice ${attribute.name} finishes ${repetitions} times. ` +
                       `Focus on proper technique and do not force painful movements.`;
                   break;
               case "playmaking":
                   description =
                       `Improve your ${attribute.name}. Complete ${repetitions} passing ` +
                       `or game-situation drills with accurate execution.`;
                   break;
               case "athleticism":
                   description =
                       `Practice ${attribute.name} with controlled, proper movement. ` +
                       `Complete ${Math.min(i + 2, 8)} quality repetitions with enough ` +
                       `rest between them. Stop if you feel pain.`;
                   break;
               case "defense":
                   description =
                       `Improve your ${attribute.name}. Complete ${repetitions} controlled ` +
                       `defensive repetitions, focusing on footwork and body control.`;
                   break;
               default:
                   description =
                       `Practice ${attribute.name} with ${repetitions} controlled repetitions.`;
           }
           challenges.push({
               id: `generated-${attribute.id}-${progression}`,
               category: attribute.group,
               attribute: attribute.id,
               title: `${attribute.name} — ${tier.difficulty} ${i}`,
               difficulty: tier.difficulty,
               description,
               reward: tier.reward,
               progression
           });
       }
   });
   return challenges;
});
const CHALLENGES = [
   ...LEGACY_CHALLENGES,
   ...GENERATED_CHALLENGES
];
function savePlayerData() {
   localStorage.setItem("hoopTrackerAttributes", JSON.stringify(attributes));
   localStorage.setItem("hoopTrackerPlayer", JSON.stringify(playerProfile));
   localStorage.setItem(
       "hoopTrackerCompletedChallenges",
       JSON.stringify(completedChallenges)
   );
}
function getOverallRating() {
   const values = Object.values(attributes);
   return Math.round(
       values.reduce((sum, value) => sum + value, 0) / values.length
   );
}
function getPlayerTier(rating) {
   if (rating >= 99) return "MAXED OUT";
   if (rating >= 90) return "ELITE";
   if (rating >= 80) return "ADVANCED";
   if (rating >= 70) return "DEVELOPING";
   return "ROOKIE";
}
function renderAttributes() {
   ATTRIBUTE_GROUPS.forEach(group => {
       const container = $("attributes-" + group.id);
       if (!container) return;
       container.innerHTML = `
<h3>${group.name}</h3>
<p>Improve your ratings through training and challenges.</p>
       `;
       group.attributes.forEach(([id, name]) => {
           const value = attributes[id];
           const progress = ((value - 60) / 39) * 100;
           const row = document.createElement("div");
           row.className = "attribute-row";
           const nameElement = document.createElement("span");
           nameElement.className = "attribute-name";
           nameElement.textContent = name;
           const valueElement = document.createElement("span");
           valueElement.className = "attribute-value";
valueElement.id = "attribute-value-" + id;
           valueElement.textContent = value;
           const track = document.createElement("div");
           track.className = "attribute-track";
           const fill = document.createElement("div");
           fill.className = "attribute-fill";
fill.id = "attribute-fill-" + id;
           fill.style.width = `${progress}%`;
           track.appendChild(fill);
           row.append(nameElement, valueElement, track);
           container.appendChild(row);
       });
   });
   updatePlayerRating();
}
function updatePlayerRating() {
   const rating = getOverallRating();
   const overallElement = $("overallRating");
   const tierElement = $("playerTier");
   const progressElement = $("playerProgressText");
   if (overallElement) overallElement.textContent = rating;
   if (tierElement) tierElement.textContent = getPlayerTier(rating);
   const improved = Object.values(attributes).filter(value => value > 60).length;
   if (progressElement) {
       progressElement.textContent =
           `${improved} / ${allAttributes.length} attributes improved above their base rating`;
   }
}
// Each generated challenge unlocks after the previous challenges for that attribute are completed.
function isChallengeUnlocked(challenge) {
   if (challenge.progression === undefined) {
       return true;
   }
   const previousChallenges = GENERATED_CHALLENGES.filter(item =>
       item.attribute === challenge.attribute &&
       item.progression < challenge.progression
   );
   return previousChallenges.every(item =>
       completedChallenges.includes(item.id)
   );
}
function renderChallenges() {
   const container = $("challengeList");
   const categoryElement = $("challengeCategory");
   const difficultyElement = $("challengeDifficulty");
   if (!container || !categoryElement || !difficultyElement) return;
   const categoryFilter = categoryElement.value;
   const difficultyFilter = difficultyElement.value;
   container.innerHTML = "";
   const filteredChallenges = CHALLENGES.filter(challenge => {
       if (!isChallengeUnlocked(challenge)) return false;
       const categoryMatches =
           categoryFilter === "all" ||
           challenge.category === categoryFilter;
       const difficultyMatches =
           difficultyFilter === "all" ||
           challenge.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
       return categoryMatches && difficultyMatches;
   });
   if (filteredChallenges.length === 0) {
       container.innerHTML =
           "<p>No challenges match these filters. Try another difficulty or category.</p>";
       return;
   }
   filteredChallenges.forEach(challenge => {
       const completed = completedChallenges.includes(challenge.id);
       const categoryName = ATTRIBUTE_GROUPS.find(
           group => group.id === challenge.category
       )?.name || challenge.category;
       const card = document.createElement("article");
       card.className = "challenge-card";
       const heading = document.createElement("h3");
       heading.textContent = challenge.title;
       const description = document.createElement("p");
       description.textContent = challenge.description;
       const meta = document.createElement("div");
       meta.className = "challenge-meta";
       const categoryTag = document.createElement("span");
       categoryTag.className = "challenge-tag";
       categoryTag.textContent = categoryName;
       const difficultyTag = document.createElement("span");
       difficultyTag.className = "challenge-tag";
       difficultyTag.textContent = challenge.difficulty;
       const reward = document.createElement("span");
       reward.className = "challenge-reward";
       reward.textContent = `+${challenge.reward} Attribute Points`;
       meta.append(categoryTag, difficultyTag, reward);
       const button = document.createElement("button");
       button.type = "button";
       button.textContent = completed ? "Completed" : "Complete Challenge";
       button.disabled = completed;
       button.addEventListener("click", () => {
           if (completedChallenges.includes(challenge.id)) return;
           const confirmed = confirm(
               `Have you completed this challenge?\n\n${challenge.title}`
           );
           if (!confirmed) return;
           completedChallenges.push(challenge.id);
           attributes[challenge.attribute] = Math.min(
               99,
               attributes[challenge.attribute] + challenge.reward
           );
           savePlayerData();
           renderAttributes();
           renderChallenges();
       });
       card.append(heading, description, meta, button);
       container.appendChild(card);
   });
}
function saveGames() {
   localStorage.setItem("hoopTrackerGames", JSON.stringify(games));
}
function saveWorkouts() {
   localStorage.setItem("hoopTrackerWorkouts", JSON.stringify(workouts));
}
function formatDate(dateString) {
   if (!dateString) return "No date";
   const date = new Date(dateString + "T12:00:00");
   if (Number.isNaN(date.getTime())) return dateString;
   return date.toLocaleDateString("en-GB", {
       year: "numeric",
       month: "short",
       day: "numeric"
   });
}
function renderGames() {
   if (!gameList) return;
   gameList.innerHTML = "";
   if (games.length === 0) {
       gameList.innerHTML = "<p>No games recorded yet.</p>";
       return;
   }
   [...games]
       .sort((a, b) => b.date.localeCompare(a.date))
       .forEach(game => {
           const item = document.createElement("div");
           item.className = "game-item";
           const details = document.createElement("div");
           const opponent = document.createElement("strong");
           opponent.textContent = game.opponent;
           const date = document.createElement("p");
           date.textContent = formatDate(game.date);
           const stats = document.createElement("p");
           stats.textContent =
               `${game.threeMade}/${game.threeAttempted} 3PT · ` +
               `${game.rebounds} REB · ${game.assists} AST`;
           details.append(opponent, date, stats);
           const score = document.createElement("strong");
           score.textContent = `${game.points} PTS`;
           const deleteButton = document.createElement("button");
           deleteButton.type = "button";
           deleteButton.textContent = "Delete";
           deleteButton.addEventListener("click", () => {
               if (!confirm("Are you sure you want to delete this game?")) return;
               games = games.filter(entry => entry.id !== game.id);
               saveGames();
               updateDashboard();
           });
           item.append(details, score, deleteButton);
           gameList.appendChild(item);
       });
}
// Keep the stored Hungarian values compatible with existing workout records.
const WORKOUT_TYPE_LABELS = {
   Doboedzes: "Shooting Workout",
   Labdakezeles: "Ball Handling",
   Eronlet: "Conditioning",
   Ugroedzes: "Jump Training",
   Csapatedzes: "Team Practice"
};
function renderWorkouts() {
   if (!workoutList) return;
   workoutList.innerHTML = "";
   if (workouts.length === 0) {
       workoutList.innerHTML = "<p>No workouts logged yet.</p>";
       return;
   }
   [...workouts]
       .sort((a, b) => b.date.localeCompare(a.date))
       .forEach(workout => {
           const item = document.createElement("div");
           item.className = "workout-item";
           const details = document.createElement("div");
           const title = document.createElement("strong");
           title.textContent = WORKOUT_TYPE_LABELS[workout.type] || workout.type;
           const date = document.createElement("p");
           date.textContent =
               `${formatDate(workout.date)} · ${workout.duration} min`;
           const note = document.createElement("p");
           note.textContent = workout.note || "No notes added.";
           details.append(title, date, note);
           const deleteButton = document.createElement("button");
           deleteButton.type = "button";
           deleteButton.textContent = "Delete";
           deleteButton.addEventListener("click", () => {
               if (!confirm("Are you sure you want to delete this workout?")) return;
               workouts = workouts.filter(entry => entry.id !== workout.id);
               saveWorkouts();
               renderWorkouts();
           });
           item.append(details, deleteButton);
           workoutList.appendChild(item);
       });
}
function updateDashboard() {
   const totalGames = games.length;
   const totalPoints = games.reduce(
       (sum, game) => sum + Number(game.points || 0),
       0
   );
   const totalThreesMade = games.reduce(
       (sum, game) => sum + Number(game.threeMade || 0),
       0
   );
   const totalThreesAttempted = games.reduce(
       (sum, game) => sum + Number(game.threeAttempted || 0),
       0
   );
   const totalRebounds = games.reduce(
       (sum, game) => sum + Number(game.rebounds || 0),
       0
   );
   const totalAssists = games.reduce(
       (sum, game) => sum + Number(game.assists || 0),
       0
   );
   if ($("pointsAverage")) {
       $("pointsAverage").textContent = totalGames
           ? (totalPoints / totalGames).toFixed(1)
           : "0.0";
   }
   if ($("threePointPercentage")) {
       $("threePointPercentage").textContent = totalThreesAttempted
           ? Math.round(totalThreesMade / totalThreesAttempted * 100) + "%"
           : "0%";
   }
   if ($("reboundsAverage")) {
       $("reboundsAverage").textContent = totalGames
           ? (totalRebounds / totalGames).toFixed(1)
           : "0.0";
   }
   if ($("assistsAverage")) {
       $("assistsAverage").textContent = totalGames
           ? (totalAssists / totalGames).toFixed(1)
           : "0.0";
   }
   const goal = Math.max(
       1,
       Number(pointsGoalInput?.value) || 30
   );
   localStorage.setItem("hoopTrackerPointsGoal", String(goal));
   const average = totalGames ? totalPoints / totalGames : 0;
   const goalProgress = Math.min(100, average / goal * 100);
   if ($("goalProgress")) {
       $("goalProgress").textContent =
           `Scoring average: ${average.toFixed(1)} / ${goal} PPG`;
   }
   if ($("goalBar")) {
       $("goalBar").style.width = `${goalProgress}%`;
   }
   if ($("goalPercentage")) {
       $("goalPercentage").textContent = `${Math.round(goalProgress)}% of goal`;
   }
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const weekStart = new Date(today);
   weekStart.setDate(today.getDate() - 6);
   const weeklyGames = games.filter(game => {
       const date = new Date(game.date + "T12:00:00");
       return date >= weekStart && date <= today;
   });
   const weeklyPoints = weeklyGames.reduce(
       (sum, game) => sum + Number(game.points || 0),
       0
   );
   const weeklyThrees = weeklyGames.reduce(
       (sum, game) => sum + Number(game.threeMade || 0),
       0
   );
   if ($("weeklyGames")) {
       $("weeklyGames").textContent = `Games this week: ${weeklyGames.length}`;
   }
   if ($("weeklyPoints")) {
       $("weeklyPoints").textContent = `Points scored this week: ${weeklyPoints}`;
   }
   if ($("weeklyAverage")) {
       $("weeklyAverage").textContent =
           `Weekly scoring average: ${
               weeklyGames.length
                   ? (weeklyPoints / weeklyGames.length).toFixed(1)
                   : "0.0"
           } PPG`;
   }
   if ($("weeklyThrees")) {
       $("weeklyThrees").textContent = `3-pointers made this week: ${weeklyThrees}`;
   }
   renderGames();
   renderRecords();
}
if (form) {
   form.addEventListener("submit", event => {
       event.preventDefault();
       const threeMade = Number($("threeMade").value);
       const threeAttempted = Number($("threeAttempted").value);
       if (threeMade > threeAttempted) {
           alert("Made three-pointers cannot exceed attempted three-pointers.");
           return;
       }
       const game = {
           id: Date.now(),
           opponent: $("opponent").value.trim(),
           date: $("gameDate").value,
           points: Number($("points").value),
           threeMade,
           threeAttempted,
           rebounds: Number($("rebounds").value),
           assists: Number($("assists").value)
       };
       games.push(game);
       saveGames();
       form.reset();
       if ($("gameDate")) {
           $("gameDate").value = getLocalDateString();
       }
       updateDashboard();
   });
}
if (workoutForm) {
   workoutForm.addEventListener("submit", event => {
       event.preventDefault();
       const workout = {
           id: Date.now(),
           type: $("workoutType").value,
           duration: Number($("workoutDuration").value),
           date: $("workoutDate").value,
           note: $("workoutNote").value.trim()
       };
       workouts.push(workout);
       saveWorkouts();
       workoutForm.reset();
       if ($("workoutDate")) {
           $("workoutDate").value = getLocalDateString();
       }
       renderWorkouts();
   });
}
if (pointsGoalInput) {
   pointsGoalInput.addEventListener("change", updateDashboard);
}
if ($("playerName")) {
   $("playerName").addEventListener("input", () => {
       playerProfile.name = $("playerName").value;
       savePlayerData();
   });
}
if ($("playerPosition")) {
   $("playerPosition").addEventListener("change", () => {
       playerProfile.position = $("playerPosition").value;
       savePlayerData();
   });
}
if ($("challengeCategory")) {
   $("challengeCategory").addEventListener("change", renderChallenges);
}
if ($("challengeDifficulty")) {
   $("challengeDifficulty").addEventListener("change", renderChallenges);
}
if ($("playerName")) {
   $("playerName").value = playerProfile.name || "";
}
if ($("playerPosition")) {
   $("playerPosition").value = playerProfile.position || "PG";
}
function getLocalDateString() {
   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, "0");
   const day = String(now.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}
const todayString = getLocalDateString();
if ($("gameDate")) {
   $("gameDate").value = todayString;
}
if ($("workoutDate")) {
   $("workoutDate").value = todayString;
}
function renderRecords() {
   const currentYear = new Date().getFullYear();
   const recordTypes = [
       {
           key: "points",
           valueId: "recordPoints",
           detailsId: "recordPointsDetails",
           seasonValueId: "seasonRecordPoints",
           seasonDetailsId: "seasonRecordPointsDetails",
           label: "points"
       },
       {
           key: "rebounds",
           valueId: "recordRebounds",
           detailsId: "recordReboundsDetails",
           seasonValueId: "seasonRecordRebounds",
           seasonDetailsId: "seasonRecordReboundsDetails",
           label: "rebounds"
       },
       {
           key: "assists",
           valueId: "recordAssists",
           detailsId: "recordAssistsDetails",
           seasonValueId: "seasonRecordAssists",
           seasonDetailsId: "seasonRecordAssistsDetails",
           label: "assists"
       },
       {
           key: "threeMade",
           valueId: "recordThrees",
           detailsId: "recordThreesDetails",
           seasonValueId: "seasonRecordThrees",
           seasonDetailsId: "seasonRecordThreesDetails",
           label: "3-pointers made"
       }
   ];
   function findRecord(list, key) {
       if (list.length === 0) return null;
       return list.reduce((best, game) => {
           return Number(game[key] || 0) > Number(best[key] || 0)
               ? game
               : best;
       });
   }
   function showRecord(valueId, detailsId, game, key, label) {
       const valueElement = $(valueId);
       const detailsElement = $(detailsId);
       if (!valueElement || !detailsElement) return;
       if (!game) {
           valueElement.textContent = "0";
           detailsElement.textContent = "No games recorded yet.";
           return;
       }
       valueElement.textContent = Number(game[key] || 0);
       detailsElement.textContent =
           `${game.opponent || "Unknown opponent"} · ` +
           `${formatDate(game.date)} · ${label}`;
   }
   const seasonGames = games.filter(game => {
       return game.date &&
           Number(game.date.slice(0, 4)) === currentYear;
   });
   recordTypes.forEach(record => {
       const careerBest = findRecord(games, record.key);
       const seasonBest = findRecord(seasonGames, record.key);
       showRecord(
           record.valueId,
           record.detailsId,
           careerBest,
           record.key,
           record.label
       );
       showRecord(
           record.seasonValueId,
           record.seasonDetailsId,
           seasonBest,
           record.key,
           record.label
       );
   });
}
const toggleChallengesButton = $("toggleChallenges");
const challengeContent = $("challengeContent");
const challengeToggleIcon = $("challengeToggleIcon");
if (toggleChallengesButton && challengeContent) {
   toggleChallengesButton.addEventListener("click", () => {
       const isOpen = !challengeContent.hidden;
       challengeContent.hidden = isOpen;
       toggleChallengesButton.setAttribute(
           "aria-expanded",
           String(!isOpen)
       );
       if (challengeToggleIcon) {
           challengeToggleIcon.textContent = isOpen ? "+" : "−";
       }
   });
}
renderAttributes();
renderChallenges();
renderWorkouts();
updateDashboard();
/* HOOPTRACKER — SMOOTH IPHONE LIQUID GLASS NAV */
(() => {
  "use strict";

  const nav = document.querySelector(".main-nav");
  if (!nav) return;

  const links = [...nav.querySelectorAll(".nav-link")];
  const indicator = nav.querySelector(".nav-indicator");

  if (!links.length || !indicator) return;

  const isIOS =
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (
      navigator.platform === "MacIntel" &&
      navigator.maxTouchPoints > 1
    );

  const mobileQuery = window.matchMedia("(max-width: 700px)");

  let activeLink = null;
  let scrollFrame = 0;
  let resizeFrame = 0;

  /*
   * A mozgó üvegjelölő kizárólag iOS-es,
   * legfeljebb 700 px széles nézetben aktív.
   */
  function shouldAnimateIndicator() {
    return isIOS && mobileQuery.matches;
  }

  function moveIndicator(link, instant = false) {
    if (!link || !shouldAnimateIndicator()) {
      indicator.style.opacity = "0";
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    if (!navRect.width || !linkRect.width) return;

    const styles = window.getComputedStyle(nav);
    const paddingLeft = parseFloat(styles.paddingLeft) || 0;

    const x =
      linkRect.left -
      navRect.left -
      nav.clientLeft -
      paddingLeft;

    if (instant) {
      indicator.style.transition = "none";
    } else {
      indicator.style.removeProperty("transition");
    }

    indicator.style.width = `${linkRect.width}px`;
    indicator.style.transform = `translate3d(${x}px, 0, 0)`;
    indicator.style.opacity = "1";

    if (instant) {
      requestAnimationFrame(() => {
        indicator.style.removeProperty("transition");
      });
    }
  }

  function setActive(link, instant = false) {
    if (!link) return;

    activeLink = link;

    links.forEach((item) => {
      const isActive = item === link;

      item.classList.toggle("active", isActive);

      if (isActive) {
        item.setAttribute("aria-current", "location");
      } else {
        item.removeAttribute("aria-current");
      }
    });

    moveIndicator(link, instant);
  }

  /*
   * A menüpontok kattintásra azonnal aktívvá válnak.
   * A natív hivatkozás továbbra is a megfelelő
   * szekcióhoz görget.
   */
  links.forEach((link) => {
    link.addEventListener("click", () => {
      setActive(link);
    });
  });

  /*
   * Görgetéskor megkeressük az aktuális szekciót.
   * requestAnimationFrame csökkenti a felesleges
   * képkockánkénti számításokat.
   */
  function updateFromScroll() {
    scrollFrame = 0;

    let bestLink = links[0];
    let bestDistance = Infinity;

    for (const link of links) {
      const href = link.getAttribute("href");

      if (!href || !href.startsWith("#")) continue;

      const target = document.querySelector(href);
      if (!target) continue;

      const rect = target.getBoundingClientRect();

      if (rect.top <= 160) {
        const distance = Math.abs(rect.top - 120);

        if (distance < bestDistance) {
          bestDistance = distance;
          bestLink = link;
        }
      }
    }

    if (bestLink !== activeLink) {
      setActive(bestLink);
    } else {
      moveIndicator(bestLink);
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;

      scrollFrame = requestAnimationFrame(updateFromScroll);
    },
    { passive: true }
  );

  /*
   * Forgatás, ablakméret-változás és betöltés után
   * újramérjük a menüpontok helyét.
   */
  function refreshNavigation() {
    if (resizeFrame) {
      cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;

      if (activeLink) {
        moveIndicator(activeLink, true);
      } else {
        const initial =
          links.find((link) => link.classList.contains("active")) ||
          links[0];

        setActive(initial, true);
      }
    });
  }

  window.addEventListener("resize", refreshNavigation, {
    passive: true
  });

  window.addEventListener("orientationchange", refreshNavigation, {
    passive: true
  });

  window.addEventListener("pageshow", refreshNavigation);

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", refreshNavigation);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(refreshNavigation);
  }

  /*
   * Kezdőállapot beállítása animáció nélkül,
   * hogy betöltéskor ne csússzon át a jelölő
   * az első menüpontra.
   */
  function initializeNavigation() {
    const initial =
      links.find((link) => link.classList.contains("active")) ||
      links[0];

    setActive(initial, true);
    updateFromScroll();
  }

  if (document.readyState === "complete") {
    initializeNavigation();
  } else {
    window.addEventListener("load", initializeNavigation, {
      once: true
    });
  }
})();
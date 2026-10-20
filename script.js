const $ = (id) => document.getElementById(id);
const form = $("gameForm");
const gameList = $("gameList");
const workoutForm = $("workoutForm");
const workoutList = $("workoutList");
const pointsGoalInput = $("pointsGoal");
let games = JSON.parse(localStorage.getItem("hoopTrackerGames") || "[]");
let workouts = JSON.parse(localStorage.getItem("hoopTrackerWorkouts") || "[]");
pointsGoalInput.value = localStorage.getItem("hoopTrackerPointsGoal") || "30";
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
   group.attributes.map(([id, name]) => ({ id, name, group: group.id }))
);
const savedAttributes = JSON.parse(
   localStorage.getItem("hoopTrackerAttributes") || "{}"
);
const attributes = Object.fromEntries(
   allAttributes.map(attribute => [
attribute.id,
       Math.max(60, Math.min(99,
           Number(savedAttributes[attribute.id]) || 60
       ))
   ])
);
let playerProfile = JSON.parse(
   localStorage.getItem("hoopTrackerPlayer") ||
   '{"name":"","position":"PG"}'
);
let completedChallenges = JSON.parse(
   localStorage.getItem("hoopTrackerCompletedChallenges") || "[]"
);
const CHALLENGES = [
   {
       id: "shoot-ft-bronze",
       category: "shooting",
       attribute: "freeThrow",
       title: "Free Throw Consistency",
       difficulty: "Bronze",
       description: "Dobj be 6 büntetőt 10 kísérletből.",
       reward: 1
   },
   {
       id: "shoot-mid-bronze",
       category: "shooting",
       attribute: "midRange",
       title: "Mid-Range Accuracy",
       difficulty: "Bronze",
       description: "Dobj be 6 középtávoli dobást 10 kísérletből.",
       reward: 1
   },
   {
       id: "shoot-three-bronze",
       category: "shooting",
       attribute: "threePoint",
       title: "Three-Point Starter",
       difficulty: "Bronze",
       description: "Dobj be 5 triplát 15 kísérletből.",
       reward: 1
   },
   {
       id: "shoot-close-bronze",
       category: "shooting",
       attribute: "closeShot",
       title: "Close Shot Control",
       difficulty: "Bronze",
       description: "Dobj be 8 közeli dobást 10 kísérletből.",
       reward: 1
   },
   {
       id: "shoot-pullup-silver",
       category: "shooting",
       attribute: "pullUp",
       title: "Pull-Up Challenge",
       difficulty: "Silver",
       description: "Dobj be 6 megállásból elengedett középtávoli dobást 10-ből.",
       reward: 1
   },
   {
       id: "shoot-catch-silver",
       category: "shooting",
       attribute: "catchShoot",
       title: "Catch & Shoot",
       difficulty: "Silver",
       description: "Passzból érkező labdával dobj be 7 dobást 10 kísérletből.",
       reward: 1
   },
   {
       id: "shooting-gold",
       category: "shooting",
       attribute: "threePoint",
       title: "Gold: Sharpshooter",
       difficulty: "Gold",
       description: "Dobj be 10 triplát 15 kísérletből, legalább 5 különböző dobóhelyről.",
       reward: 2
   },
   {
       id: "shooting-gold-midrange",
       category: "shooting",
       attribute: "midRange",
       title: "Gold: Mid-Range Specialist",
       difficulty: "Gold",
       description: "Dobj be 8 középtávoli dobást 10 kísérletből, legalább 3 különböző helyről.",
       reward: 2
   },
   {
       id: "shooting-gold-free-throw",
       category: "shooting",
       attribute: "freeThrow",
       title: "Gold: Ice in the Veins",
       difficulty: "Gold",
       description: "Dobj be egymás után 9 büntetőt 10 kísérletből.",
       reward: 2
   },
   {
       id: "handle-control-bronze",
       category: "handling",
       attribute: "ballControl",
       title: "Ball Control Basics",
       difficulty: "Bronze",
       description: "Végezz 30 másodperc folyamatos labdavezetést labdavesztés nélkül.",
       reward: 1
   },
   {
       id: "handle-weak-bronze",
       category: "handling",
       attribute: "weakHand",
       title: "Weak Hand",
       difficulty: "Bronze",
       description: "Végezz 30 szabályos gyenge kezes leütést.",
       reward: 1
   },
   {
       id: "handle-crossover-bronze",
       category: "handling",
       attribute: "crossover",
       title: "Crossover Control",
       difficulty: "Bronze",
       description: "Végezz 30 szabályos crossover leütést.",
       reward: 1
   },
   {
       id: "handle-between-silver",
       category: "handling",
       attribute: "betweenLegs",
       title: "Between-the-Legs",
       difficulty: "Silver",
       description: "Végezz 20 egymást követő, hibátlan láb közötti labdavezetést.",
       reward: 1
   },
   {
       id: "handle-behind-silver",
       category: "handling",
       attribute: "behindBack",
       title: "Behind-the-Back",
       difficulty: "Silver",
       description: "Végezz 15 szabályos hát mögötti labdavezetést.",
       reward: 1
   },
   {
       id: "handling-gold-combo",
       category: "handling",
       attribute: "comboMoves",
       title: "Gold: Combo Creator",
       difficulty: "Gold",
       description: "Végezz 5 különböző cselekombinációt egymás után labdavesztés nélkül, majd fejezd be dobással.",
       reward: 2
   },
   {
       id: "handling-gold-weak-hand",
       category: "handling",
       attribute: "weakHand",
       title: "Gold: Weak-Hand Master",
       difficulty: "Gold",
       description: "Vezesd a labdát gyengébb kézzel 60 másodpercig, majd hajts végre 10 sikeres gyenge kezes befejezést.",
       reward: 2
   },
   {
       id: "finish-right-bronze",
       category: "finishing",
       attribute: "rightLayup",
       title: "Right-Hand Finishing",
       difficulty: "Bronze",
       description: "Dobj be 8 jobbkezes ziccert 10 kísérletből.",
       reward: 1
   },
   {
       id: "finish-left-bronze",
       category: "finishing",
       attribute: "leftLayup",
       title: "Left-Hand Finishing",
       difficulty: "Bronze",
       description: "Dobj be 7 balkezes ziccert 10 kísérletből.",
       reward: 1
   },
   {
       id: "finish-floater-silver",
       category: "finishing",
       attribute: "floater",
       title: "Floater Touch",
       difficulty: "Silver",
       description: "Dobj be 6 floatert 10 kísérletből, mindkét oldalról.",
       reward: 1
   },
   {
       id: "finishing-gold",
       category: "finishing",
       attribute: "drivingLayup",
       title: "Gold: Finishing Package",
       difficulty: "Gold",
       description: "Dobj be 8 ziccert 10 kísérletből jobbkezes, balkezes és reverse befejezésekkel.",
       reward: 2
   },
   {
       id: "finishing-gold-floater",
       category: "finishing",
       attribute: "floater",
       title: "Gold: Floater Specialist",
       difficulty: "Gold",
       description: "Dobj be 8 floatert 10 kísérletből a pálya mindkét oldaláról.",
       reward: 2
   },
   {
       id: "play-pass-bronze",
       category: "playmaking",
       attribute: "passAccuracy",
       title: "Passing Accuracy",
       difficulty: "Bronze",
       description: "Találj el egy kijelölt célterületet 8 alkalommal 10 passzból.",
       reward: 1
   },
   {
       id: "play-vision-silver",
       category: "playmaking",
       attribute: "courtVision",
       title: "Court Vision",
       difficulty: "Silver",
       description: "Edzőpartnerrel végezz 10 jó döntést igénylő passzgyakorlatot.",
       reward: 1
   },
   {
       id: "playmaking-gold",
       category: "playmaking",
       attribute: "decisionMaking",
       title: "Gold: Floor General",
       difficulty: "Gold",
       description: "Edzőpartnerrel hajts végre 10 játékhelyzetet, és legalább 8 alkalommal válaszd a jó passzt vagy befejezést.",
       reward: 2
   },
   {
       id: "athletic-agility-bronze",
       category: "athleticism",
       attribute: "agility",
       title: "Agility Test",
       difficulty: "Bronze",
       description: "Rögzítsd egy szabályos ingafutás idejét, majd ismételd meg azonos pályán.",
       reward: 1
   },
   {
       id: "athletic-jump-bronze",
       category: "athleticism",
       attribute: "verticalJump",
       title: "Vertical Jump Baseline",
       difficulty: "Bronze",
       description: "Mérd meg három szabályos ugrásodat, és rögzítsd a legjobb eredményt.",
       reward: 1
   },
   {
       id: "athleticism-gold",
       category: "athleticism",
       attribute: "stamina",
       title: "Gold: Fourth-Quarter Engine",
       difficulty: "Gold",
       description: "Végezz 4 intenzív, 2 perces kondicionáló kört, köztük 1 perc pihenővel. Fájdalom esetén állj meg.",
       reward: 2
   },
   {
       id: "defense-footwork-bronze",
       category: "defense",
       attribute: "defensiveFootwork",
       title: "Defensive Footwork",
       difficulty: "Bronze",
       description: "Végezz 3 × 20 másodperc oldalazó védekező lábmunkát.",
       reward: 1
   },
   {
       id: "defense-rebound-silver",
       category: "defense",
       attribute: "rebounding",
       title: "Rebound Positioning",
       difficulty: "Silver",
       description: "Edzőpartnerrel hajts végre 8 szabályos lepattanóhelyezkedési ismétlést 10-ből.",
       reward: 1
   },
   {
       id: "defense-gold",
       category: "defense",
       attribute: "perimeterDefense",
       title: "Gold: Lockdown Defender",
       difficulty: "Gold",
       description: "Edzőpartnerrel végezz 10 egy-egy elleni védekező ismétlést, és legalább 7-szer maradj a támadó előtt szabálytalanság nélkül.",
       reward: 2
   }
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
<p>Fejleszd az értékeidet edzéssel és kihívásokkal.</p>
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
   $("overallRating").textContent = rating;
   $("playerTier").textContent = getPlayerTier(rating);
   const improved = Object.values(attributes).filter(value => value > 60).length;
   $("playerProgressText").textContent =
       `${improved} / ${allAttributes.length} képesség fejlesztve az alapérték fölé`;
}
function renderChallenges() {
   const container = $("challengeList");
   const categoryFilter = $("challengeCategory").value;
   const difficultyFilter = $("challengeDifficulty").value;
   container.innerHTML = "";
   const filteredChallenges = CHALLENGES.filter(challenge => {
       const categoryMatches =
           categoryFilter === "all" || challenge.category === categoryFilter;
       const difficultyMatches =
           difficultyFilter === "all" ||
           challenge.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
       return categoryMatches && difficultyMatches;
   });
   if (filteredChallenges.length === 0) {
       container.innerHTML = "<p>Nincs találat ezekkel a szűrőkkel.</p>";
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
       reward.textContent = `+${challenge.reward} képességpont`;
       meta.append(categoryTag, difficultyTag, reward);
       const button = document.createElement("button");
       button.textContent = completed ? "Teljesítve" : "Kihívás teljesítése";
       button.disabled = completed;
       button.addEventListener("click", () => {
           const confirmed = confirm(
               `Valóban teljesítetted ezt a kihívást?\n\n${challenge.title}`
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
   if (!dateString) return "Nincs dátum";
   const date = new Date(dateString + "T12:00:00");
   if (Number.isNaN(date.getTime())) return dateString;
   return date.toLocaleDateString("hu-HU", {
       year: "numeric",
       month: "short",
       day: "numeric"
   });
}
function renderGames() {
   gameList.innerHTML = "";
   if (games.length === 0) {
       gameList.innerHTML = "<p>Még nincs rögzített mérkőzés.</p>";
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
               `${game.threeMade}/${game.threeAttempted} tripla · ` +
               `${game.rebounds} lepattanó · ${game.assists} gólpassz`;
           details.append(opponent, date, stats);
           const score = document.createElement("strong");
           score.textContent = `${game.points} PTS`;
           const deleteButton = document.createElement("button");
           deleteButton.type = "button";
           deleteButton.textContent = "Törlés";
           deleteButton.addEventListener("click", () => {
               if (!confirm("Biztosan törlöd ezt a mérkőzést?")) return;
               games = games.filter(entry => entry.id !== game.id);
               saveGames();
               updateDashboard();
           });
           item.append(details, score, deleteButton);
           gameList.appendChild(item);
       });
}
function renderWorkouts() {
   workoutList.innerHTML = "";
   if (workouts.length === 0) {
       workoutList.innerHTML = "<p>Még nincs rögzített edzés.</p>";
       return;
   }
   [...workouts]
       .sort((a, b) => b.date.localeCompare(a.date))
       .forEach(workout => {
           const item = document.createElement("div");
           item.className = "workout-item";
           const details = document.createElement("div");
           const title = document.createElement("strong");
           title.textContent = workout.type;
           const date = document.createElement("p");
           date.textContent =
               `${formatDate(workout.date)} · ${workout.duration} perc`;
           const note = document.createElement("p");
           note.textContent = workout.note || "Nincs megjegyzés.";
           details.append(title, date, note);
           const deleteButton = document.createElement("button");
           deleteButton.type = "button";
           deleteButton.textContent = "Törlés";
           deleteButton.addEventListener("click", () => {
               if (!confirm("Biztosan törlöd ezt az edzést?")) return;
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
       (sum, game) => sum + Number(game.points || 0), 0
   );
   const totalThreesMade = games.reduce(
       (sum, game) => sum + Number(game.threeMade || 0), 0
   );
   const totalThreesAttempted = games.reduce(
       (sum, game) => sum + Number(game.threeAttempted || 0), 0
   );
   const totalRebounds = games.reduce(
       (sum, game) => sum + Number(game.rebounds || 0), 0
   );
   const totalAssists = games.reduce(
       (sum, game) => sum + Number(game.assists || 0), 0
   );
   $("pointsAverage").textContent = totalGames
       ? (totalPoints / totalGames).toFixed(1)
       : "0.0";
   $("threePointPercentage").textContent = totalThreesAttempted
       ? Math.round(totalThreesMade / totalThreesAttempted * 100) + "%"
       : "0%";
   $("reboundsAverage").textContent = totalGames
       ? (totalRebounds / totalGames).toFixed(1)
       : "0.0";
   $("assistsAverage").textContent = totalGames
       ? (totalAssists / totalGames).toFixed(1)
       : "0.0";
   const goal = Math.max(1, Number(pointsGoalInput.value) || 30);
   localStorage.setItem("hoopTrackerPointsGoal", String(goal));
   const average = totalGames ? totalPoints / totalGames : 0;
   const goalProgress = Math.min(100, average / goal * 100);
   $("goalProgress").textContent = `${average.toFixed(1)} / ${goal}`;
   $("goalBar").style.width = `${goalProgress}%`;
   $("goalPercentage").textContent = `${Math.round(goalProgress)}%`;
   const today = new Date();
   today.setHours(0, 0, 0, 0);
   const weekStart = new Date(today);
   weekStart.setDate(today.getDate() - 6);
   const weeklyGames = games.filter(game => {
       const date = new Date(game.date + "T12:00:00");
       return date >= weekStart && date <= today;
   });
   const weeklyPoints = weeklyGames.reduce(
       (sum, game) => sum + Number(game.points || 0), 0
   );
   const weeklyThrees = weeklyGames.reduce(
       (sum, game) => sum + Number(game.threeMade || 0), 0
   );
   $("weeklyGames").textContent = weeklyGames.length;
   $("weeklyPoints").textContent = weeklyPoints;
   $("weeklyAverage").textContent = weeklyGames.length
       ? (weeklyPoints / weeklyGames.length).toFixed(1)
       : "0.0";
   $("weeklyThrees").textContent = weeklyThrees;
  renderGames();
renderRecords();
}
form.addEventListener("submit", event => {
   event.preventDefault();
   const threeMade = Number($("threeMade").value);
   const threeAttempted = Number($("threeAttempted").value);
   if (threeMade > threeAttempted) {
       alert("A bedobott triplák száma nem lehet nagyobb a kísérletek számánál.");
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
   $("gameDate").value = getLocalDateString();
   updateDashboard();
});
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
   $("workoutDate").value = getLocalDateString();
   renderWorkouts();
});
pointsGoalInput.addEventListener("change", updateDashboard);
$("playerName").addEventListener("input", () => {
   playerProfile.name = $("playerName").value;
   savePlayerData();
});
$("playerPosition").addEventListener("change", () => {
   playerProfile.position = $("playerPosition").value;
   savePlayerData();
});
$("challengeCategory").addEventListener("change", renderChallenges);
$("challengeDifficulty").addEventListener("change", renderChallenges);
$("playerName").value = playerProfile.name || "";
$("playerPosition").value = playerProfile.position || "PG";
function getLocalDateString() {
   const now = new Date();
   const year = now.getFullYear();
   const month = String(now.getMonth() + 1).padStart(2, "0");
   const day = String(now.getDate()).padStart(2, "0");
   return `${year}-${month}-${day}`;
}
const todayString = getLocalDateString();
if ($("gameDate")) $("gameDate").value = todayString;
if ($("workoutDate")) $("workoutDate").value = todayString;
renderAttributes();
renderChallenges();
renderWorkouts();
updateDashboard();
function renderRecords() {
   const currentYear = new Date().getFullYear();
   const recordTypes = [
       {
           key: "points",
           valueId: "recordPoints",
           detailsId: "recordPointsDetails",
           seasonValueId: "seasonRecordPoints",
           seasonDetailsId: "seasonRecordPointsDetails",
           label: "pont"
       },
       {
           key: "rebounds",
           valueId: "recordRebounds",
           detailsId: "recordReboundsDetails",
           seasonValueId: "seasonRecordRebounds",
           seasonDetailsId: "seasonRecordReboundsDetails",
           label: "lepattanó"
       },
       {
           key: "assists",
           valueId: "recordAssists",
           detailsId: "recordAssistsDetails",
           seasonValueId: "seasonRecordAssists",
           seasonDetailsId: "seasonRecordAssistsDetails",
           label: "gólpassz"
       },
       {
           key: "threeMade",
           valueId: "recordThrees",
           detailsId: "recordThreesDetails",
           seasonValueId: "seasonRecordThrees",
           seasonDetailsId: "seasonRecordThreesDetails",
           label: "bedobott tripla"
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
           detailsElement.textContent = "Még nincs rögzített meccs.";
           return;
       }
       valueElement.textContent = Number(game[key] || 0);
       detailsElement.textContent =
           `${game.opponent || "Ismeretlen ellenfél"} · ` +
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
 
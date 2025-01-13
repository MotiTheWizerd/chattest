// Function to save instructions to local storage
const saveInstructionsToStorage = (instructions) => {
  localStorage.setItem("chatInstructions", JSON.stringify(instructions));
};

// Function to load instructions from local storage
const loadInstructionsFromStorage = () => {
  const saved = localStorage.getItem("chatInstructions");
  return saved ? JSON.parse(saved) : defaultInstructions; // Use default if none saved
};

// Initialize state with loaded instructions
const instructionsState = {
  instructions: loadInstructionsFromStorage(),
  // ... other state properties
};

// Update mutation to save instructions
const mutations = {
  updateInstructions(state, newInstructions) {
    state.instructions = newInstructions;
    saveInstructionsToStorage(newInstructions);
  },
  // ... other mutations
};

class IntervalTimer {
    constructor() {
        this.workTime = 30; // seconds (will be updated from input)
        this.restTime = 15; // seconds (will be updated from input)
        this.totalCycles = 8;
        this.currentCycle = 0;
        this.timeRemaining = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.isWorkPhase = true;
        this.timerInterval = null;
        
        // Custom workout mode
        this.isCustomMode = false;
        this.customIntervals = [];
        this.currentIntervalIndex = 0;
        this.customTotalCycles = 1;
        this.currentCustomCycle = 1;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeTimeValues();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.timeDisplay = document.getElementById('timeDisplay');
        this.phaseIndicator = document.getElementById('phaseIndicator');
        this.workTimeInput = document.getElementById('workTime');
        this.restTimeInput = document.getElementById('restTime');
        this.cyclesInput = document.getElementById('cycles');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.skipBtn = document.getElementById('skipBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.startMainBtn = document.getElementById('startMainBtn');
        this.startBuilderBtn = document.getElementById('startBuilderBtn');
        this.startJsonBtn = document.getElementById('startJsonBtn');
        this.currentCycleSpan = document.getElementById('currentCycle');
        this.totalCyclesSpan = document.getElementById('totalCycles');
        this.progressFill = document.getElementById('progressFill');
        
        // Custom cycle elements
        this.customCyclesInput = document.getElementById('customCycles');
        this.builderCyclesInput = document.getElementById('builderCycles');
        this.cycleCounter = document.getElementById('cycleCounter');
        this.currentWorkoutCycleSpan = document.getElementById('currentWorkoutCycle');
        this.totalWorkoutCyclesSpan = document.getElementById('totalWorkoutCycles');
        
        // Mode switching elements
        this.simpleModeRadio = document.getElementById('simpleMode');
        this.customModeRadio = document.getElementById('customMode');
        this.visualizationModeRadio = document.getElementById('visualizationMode');
        this.helpBtn = document.getElementById('helpBtn');
        this.simpleSettings = document.getElementById('simpleSettings');
        this.customSettings = document.getElementById('customSettings');
        this.visualizationSettings = document.getElementById('visualizationSettings');
        this.jsonInput = document.getElementById('jsonInput');
        this.jsonStatus = document.getElementById('jsonStatus');
        this.loadJsonBtn = document.getElementById('loadJsonBtn');
        
        // Visualization elements
        this.vizJsonInput = document.getElementById('vizJsonInput');
        this.vizStatus = document.getElementById('vizStatus');
        this.generateChartBtn = document.getElementById('generateChartBtn');
        this.clearChartBtn = document.getElementById('clearChartBtn');
        this.chartContainer = document.getElementById('chartContainer');
        this.workoutChart = document.getElementById('workoutChart');
        this.currentChart = null;
        
        // Workout completion elements
        this.modalOverlay = document.getElementById('modalOverlay');
        this.workoutCompleteSection = document.getElementById('workoutCompleteSection');
        this.generateVizDataBtn = document.getElementById('generateVizDataBtn');
        this.dismissCompleteBtn = document.getElementById('dismissCompleteBtn');
        this.generatedJsonSection = document.getElementById('generatedJsonSection');
        this.generatedJsonOutput = document.getElementById('generatedJsonOutput');
        this.copyJsonBtn = document.getElementById('copyJsonBtn');
        this.addToVizBtn = document.getElementById('addToVizBtn');
        this.clearVizDataBtn = document.getElementById('clearVizDataBtn');
        
        // Other notes elements
        this.otherNotesSection = document.getElementById('otherNotesSection');
        this.otherNotesInput = document.getElementById('otherNotesInput');
        
        // Help modal elements
        this.helpModalOverlay = document.getElementById('helpModalOverlay');
        this.closeHelpModalBtn = document.getElementById('closeHelpModal');
        
        // Day help modal elements
        this.dayHelpModalOverlay = document.getElementById('dayHelpModalOverlay');
        this.dayAdvancedBtn = document.getElementById('dayAdvancedBtn');
        this.closeDayHelpModalBtn = document.getElementById('closeDayHelpModal');
        
        // Copy example JSON button
        this.copyExampleJsonBtn = document.getElementById('copyExampleJsonBtn');
        
        // Clear JSON button
        this.clearJsonBtn = document.getElementById('clearJsonBtn');
        
        // Simple mode help modal elements
        this.simpleHelpModalOverlay = document.getElementById('simpleHelpModalOverlay');
        this.simpleHelpModal = document.getElementById('simpleHelpModal');
        this.closeSimpleHelpModal = document.getElementById('closeSimpleHelpModal');
        
        // Custom mode help modal elements
        this.customHelpModalOverlay = document.getElementById('customHelpModalOverlay');
        this.customHelpModal = document.getElementById('customHelpModal');
        this.closeCustomHelpModal = document.getElementById('closeCustomHelpModal');
        
        // Unit button elements
        this.unitButtons = document.querySelectorAll('.unit-btn');
        
        // Preset buttons
        this.pomodoroBtn = document.getElementById('pomodoroBtn');
        this.simpleTimerBtn = document.getElementById('simpleTimerBtn');
        
        // Welcome modal elements
        this.welcomeModalOverlay = document.getElementById('welcomeModalOverlay');
        this.welcomeModal = document.getElementById('welcomeModal');
        this.closeWelcomeModal = document.getElementById('closeWelcomeModal');
        this.welcomeSimpleBtn = document.getElementById('welcomeSimpleBtn');
        this.welcomeCustomBtn = document.getElementById('welcomeCustomBtn');
        this.welcomeVizBtn = document.getElementById('welcomeVizBtn');
        
        // Builder elements
        this.builderTab = document.getElementById('builderTab');
        this.jsonTab = document.getElementById('jsonTab');
        this.builderSection = document.getElementById('builderSection');
        this.jsonSection = document.getElementById('jsonSection');
        this.addIntervalBtn = document.getElementById('addIntervalBtn');
        this.generateJsonBtn = document.getElementById('generateJsonBtn');
        this.intervalsContainer = document.getElementById('intervalsContainer');
        this.builderStatus = document.getElementById('builderStatus');
        
        this.intervalCounter = 0;
    }
    
    initializeTimeValues() {
        // Set initial time values from inputs and unit selection
        this.updateTimeFromInputs();
        
        // Initialize builder with default intervals
        this.initializeBuilder();
    }

    bindEvents() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.skipBtn.addEventListener('click', () => this.skip());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.startMainBtn.addEventListener('click', () => this.start());
        this.startBuilderBtn.addEventListener('click', () => this.start());
        this.startJsonBtn.addEventListener('click', () => this.start());
        
        // Mode switching
        this.simpleModeRadio.addEventListener('change', () => this.switchMode());
        this.customModeRadio.addEventListener('change', () => this.switchMode());
        this.visualizationModeRadio.addEventListener('change', () => this.switchMode());
        this.helpBtn.addEventListener('click', () => this.toggleHelp());
        this.loadJsonBtn.addEventListener('click', () => this.loadFromJson());
        
        // Visualization mode events
        this.generateChartBtn.addEventListener('click', () => this.generateChart());
        this.clearChartBtn.addEventListener('click', () => this.clearChart());
        this.clearVizDataBtn.addEventListener('click', () => this.clearVisualizationData());
        
        // Workout completion events
        this.generateVizDataBtn.addEventListener('click', () => this.generateWorkoutJson());
        this.dismissCompleteBtn.addEventListener('click', () => this.dismissWorkoutComplete());
        this.copyJsonBtn.addEventListener('click', () => this.copyJsonToClipboard());
        this.addToVizBtn.addEventListener('click', () => this.addJsonToVisualization());
        
        // Help modal events
        this.closeHelpModalBtn.addEventListener('click', () => this.closeVisualizationHelp());
        this.helpModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.helpModalOverlay) this.closeVisualizationHelp();
        });
        
        // Day help modal events
        this.dayAdvancedBtn.addEventListener('click', () => this.showDayHelp());
        this.closeDayHelpModalBtn.addEventListener('click', () => this.closeDayHelp());
        this.dayHelpModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.dayHelpModalOverlay) this.closeDayHelp();
        });
        
        // Copy example JSON button event
        this.copyExampleJsonBtn.addEventListener('click', () => this.copyExampleJson());
        
        // Clear JSON button event
        this.clearJsonBtn.addEventListener('click', () => this.clearJson());
        
        // Simple mode help modal events
        this.closeSimpleHelpModal.addEventListener('click', () => this.closeSimpleHelp());
        
        // Custom mode help modal events  
        this.closeCustomHelpModal.addEventListener('click', () => this.closeCustomHelp());
        
        // Input change handlers
        this.workTimeInput.addEventListener('input', () => this.updateTimeFromInputs());
        this.restTimeInput.addEventListener('input', () => this.updateTimeFromInputs());
        
        // Unit button clicks
        this.unitButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleUnitButtonClick(e));
        });
        
        // Preset button clicks
        this.pomodoroBtn.addEventListener('click', () => this.setupPomodoro());
        this.simpleTimerBtn.addEventListener('click', () => this.setupSimpleTimer());
        
        // Welcome modal events
        this.closeWelcomeModal.addEventListener('click', () => this.closeWelcome());
        this.welcomeSimpleBtn.addEventListener('click', () => this.startSimpleMode());
        this.welcomeCustomBtn.addEventListener('click', () => this.startCustomMode());
        this.welcomeVizBtn.addEventListener('click', () => this.startVisualizationMode());
        
        // Close welcome modal when clicking outside of it
        this.welcomeModalOverlay.addEventListener('click', (e) => {
            if (e.target === this.welcomeModalOverlay) {
                this.closeWelcome();
            }
        });
        
        // Builder interface
        this.builderTab.addEventListener('click', () => this.switchToBuilder());
        this.jsonTab.addEventListener('click', () => this.switchToJson());
        this.addIntervalBtn.addEventListener('click', () => this.addInterval());
        this.generateJsonBtn.addEventListener('click', () => this.generateFromBuilder());
        
        this.cyclesInput.addEventListener('change', () => {
            this.totalCycles = parseInt(this.cyclesInput.value);
            this.totalCyclesSpan.textContent = this.totalCycles;
            if (!this.isRunning) this.updateDisplay();
        });
        
        this.customCyclesInput.addEventListener('change', () => {
            this.customTotalCycles = parseInt(this.customCyclesInput.value);
            // Sync the other input
            this.builderCyclesInput.value = this.customTotalCycles;
            // Force update display to refresh cycle counter
            this.updateDisplay();
        });
        
        this.builderCyclesInput.addEventListener('change', () => {
            this.customTotalCycles = parseInt(this.builderCyclesInput.value);
            // Sync the other input
            this.customCyclesInput.value = this.customTotalCycles;
            // Force update display to refresh cycle counter
            this.updateDisplay();
        });
        
        // Add listener for JSON input changes for bidirectional sync
        this.jsonInput.addEventListener('input', () => {
            if (this.validateJson()) {
                // Only sync if JSON is valid
                try {
                    const rawIntervals = JSON.parse(this.jsonInput.value.trim());
                    this.syncJsonToBuilder(rawIntervals);
                } catch (error) {
                    // Invalid JSON, don't sync
                }
            }
        });
        
        // JSON input validation
        this.jsonInput.addEventListener('input', () => this.validateJson());
        
        // Global keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning && !this.isPaused) {
                e.preventDefault();
                this.skip();
            }
            if (e.key === 'Escape') {
                // Close any open modals (check which one is open to avoid conflicts)
                if (this.helpModalOverlay.style.display === 'flex') {
                    this.closeVisualizationHelp();
                } else if (this.simpleHelpModalOverlay.style.display === 'flex') {
                    this.closeSimpleHelp();
                } else if (this.customHelpModalOverlay.style.display === 'flex') {
                    this.closeCustomHelp();
                } else if (this.dayHelpModalOverlay.style.display === 'flex') {
                    this.closeDayHelp();
                } else if (this.welcomeModalOverlay.style.display === 'flex') {
                    this.closeWelcome();
                } else if (this.modalOverlay.style.display === 'flex') {
                    this.dismissWorkoutComplete();
                }
            }
        });
        
        // Clear JSON button functionality
        document.getElementById('clearJsonBtn').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the JSON data? This action cannot be undone.')) {
                document.getElementById('jsonInput').value = '';
                this.clearJsonStatus();
            }
        });
        
        // Copy JSON button functionality
        document.getElementById('copyJsonInputBtn').addEventListener('click', () => {
            const jsonTextarea = document.getElementById('jsonInput');
            const jsonContent = jsonTextarea.value.trim();
            
            if (jsonContent === '') {
                this.showJsonStatus('No JSON content to copy', 'error');
                return;
            }
            
            navigator.clipboard.writeText(jsonContent).then(() => {
                this.showJsonStatus('JSON copied to clipboard!', 'success');
            }).catch(err => {
                // Fallback for older browsers
                jsonTextarea.select();
                document.execCommand('copy');
                this.showJsonStatus('JSON copied to clipboard!', 'success');
            });
        });
        
        // Copy Visualization JSON button functionality
        document.getElementById('copyVizJsonBtn').addEventListener('click', () => {
            const vizTextarea = document.getElementById('vizJsonInput');
            const vizContent = vizTextarea.value.trim();
            
            if (vizContent === '') {
                this.showVizStatus('No JSON content to copy', 'error');
                return;
            }
            
            navigator.clipboard.writeText(vizContent).then(() => {
                this.showVizStatus('JSON copied to clipboard!', 'success');
            }).catch(err => {
                // Fallback for older browsers
                vizTextarea.select();
                document.execCommand('copy');
                this.showVizStatus('JSON copied to clipboard!', 'success');
            });
        });
    }
    
    switchMode() {
        if (this.isRunning) return; // Don't allow mode switching during timer
        
        this.isCustomMode = this.customModeRadio.checked;
        this.isVisualizationMode = this.visualizationModeRadio.checked;
        
        // Hide all settings sections first
        this.simpleSettings.style.display = 'none';
        this.customSettings.style.display = 'none';
        this.visualizationSettings.style.display = 'none';
        
        if (this.isVisualizationMode) {
            // Data Visualization mode
            this.visualizationSettings.style.display = 'block';
        } else if (this.isCustomMode) {
            // Custom JSON mode
            this.customSettings.style.display = 'block';
        } else {
            // Simple mode
            this.simpleSettings.style.display = 'block';
        }
        
        this.reset();
    }
    
    toggleHelp() {
        // Show appropriate modal based on current mode
        if (this.isVisualizationMode) {
            this.showVisualizationHelp();
        } else if (this.isCustomMode) {
            this.showCustomHelp();
        } else {
            this.showSimpleHelp();
        }
    }
    
    handleUnitButtonClick(event) {
        if (this.isRunning) return; // Don't allow changes during timer
        
        const button = event.target;
        const target = button.dataset.target;
        const unit = button.dataset.unit;
        
        // Remove active class from other unit buttons of the same target
        document.querySelectorAll(`.unit-btn[data-target="${target}"]`).forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Update time values based on new unit
        this.updateTimeFromInputs();
    }
    
    updateTimeFromInputs() {
        if (this.isRunning) return; // Don't allow changes during timer
        
        // Get work time
        const workValue = parseInt(this.workTimeInput.value) || 0;
        const workUnit = document.querySelector('.unit-btn[data-target="work"].active')?.dataset.unit || 'seconds';
        this.workTime = workUnit === 'minutes' ? workValue * 60 : workValue;
        
        // Get rest time
        const restValue = parseInt(this.restTimeInput.value) || 0;
        const restUnit = document.querySelector('.unit-btn[data-target="rest"].active')?.dataset.unit || 'seconds';
        this.restTime = restUnit === 'minutes' ? restValue * 60 : restValue;
        
        // Update display if timer is not running
        if (!this.isRunning) {
            this.updateDisplay();
        }
    }
    
    setupPomodoro() {
        if (this.isRunning) return; // Don't allow changes during timer
        
        // Set Pomodoro values: 25 minutes work, 5 minutes rest, 4 cycles
        this.workTimeInput.value = 25;
        this.restTimeInput.value = 5;
        this.cyclesInput.value = 4;
        
        // Set unit buttons to minutes
        document.querySelectorAll('.unit-btn[data-target="work"]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === 'minutes') {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.unit-btn[data-target="rest"]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === 'minutes') {
                btn.classList.add('active');
            }
        });
        
        // Update internal values
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.restTime = 5 * 60;  // 5 minutes in seconds
        this.totalCycles = 4;
        
        this.updateDisplay();
    }
    
    setupSimpleTimer() {
        if (this.isRunning) return; // Don't allow changes during timer
        
        // Set Simple Timer values: 30 minutes work, no rest, 1 cycle
        this.workTimeInput.value = 30;
        this.restTimeInput.value = 0;
        this.cyclesInput.value = 1;
        
        // Set unit buttons to minutes for work, seconds for rest
        document.querySelectorAll('.unit-btn[data-target="work"]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === 'minutes') {
                btn.classList.add('active');
            }
        });
        
        document.querySelectorAll('.unit-btn[data-target="rest"]').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.unit === 'seconds') {
                btn.classList.add('active');
            }
        });
        
        // Update internal values
        this.workTime = 30 * 60; // 30 minutes in seconds
        this.restTime = 0;       // No rest
        this.totalCycles = 1;    // Single cycle
        
        this.updateDisplay();
    }
    
    // Builder interface methods
    initializeBuilder() {
        // Add some default intervals
        this.addInterval('Push-ups', '45s', '');
        this.addInterval('Rest', '15s', '');
        this.addInterval('Squats', '30s', '');
        this.addInterval('Rest', '15s', '');
    }
    
    switchToBuilder() {
        this.builderTab.classList.add('active');
        this.jsonTab.classList.remove('active');
        this.builderSection.style.display = 'block';
        this.jsonSection.style.display = 'none';
    }
    
    switchToJson() {
        this.builderTab.classList.remove('active');
        this.jsonTab.classList.add('active');
        this.builderSection.style.display = 'none';
        this.jsonSection.style.display = 'block';
        this.clearBuilderStatus();
    }
    
    clearBuilderStatus() {
        this.builderStatus.textContent = '';
        this.builderStatus.className = 'builder-status';
    }
    
    addInterval(label = '', time = '', notes = '') {
        this.intervalCounter++;
        const intervalDiv = document.createElement('div');
        intervalDiv.className = 'interval-card';
        intervalDiv.dataset.intervalId = this.intervalCounter;
        intervalDiv.draggable = true;
        
        intervalDiv.innerHTML = `
            <div class="drag-handle" title="Drag to reorder">⋮⋮</div>
            <input type="text" class="label-input" placeholder="Exercise name" value="${label}">
            <input type="text" class="time-input" placeholder="30s" value="${time}">
            <input type="text" class="notes-input" placeholder="notes (optional)" value="${notes}">
            <div class="interval-controls">
                <button class="remove-btn" data-interval-id="${this.intervalCounter}" title="Remove">✕</button>
            </div>
        `;
        
        // Add event listener for the remove button
        const removeBtn = intervalDiv.querySelector('.remove-btn');
        const currentId = this.intervalCounter; // Capture the ID at creation time
        
        removeBtn.addEventListener('click', () => this.removeInterval(currentId));
        
        // Add drag and drop event listeners
        intervalDiv.addEventListener('dragstart', (e) => this.handleDragStart(e));
        intervalDiv.addEventListener('dragover', (e) => this.handleDragOver(e));
        intervalDiv.addEventListener('drop', (e) => this.handleDrop(e));
        intervalDiv.addEventListener('dragend', (e) => this.handleDragEnd(e));
        intervalDiv.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        intervalDiv.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        
        this.intervalsContainer.appendChild(intervalDiv);
        this.clearBuilderStatus();
    }
    
    removeInterval(intervalId) {
        const intervalDiv = this.intervalsContainer.querySelector(`[data-interval-id="${intervalId}"]`);
        if (intervalDiv) {
            intervalDiv.remove();
            this.clearBuilderStatus();
        }
    }
    
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    handleDragEnter(e) {
        e.preventDefault();
        if (e.target.classList.contains('interval-card') && e.target !== this.draggedElement) {
            e.target.classList.add('drag-over');
        }
    }
    
    handleDragLeave(e) {
        if (e.target.classList.contains('interval-card')) {
            e.target.classList.remove('drag-over');
        }
    }
    
    handleDrop(e) {
        e.preventDefault();
        const target = e.target.closest('.interval-card');
        
        if (target && target !== this.draggedElement) {
            const draggedRect = this.draggedElement.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            
            // Determine if we should insert before or after the target
            const insertAfter = e.clientY > targetRect.top + targetRect.height / 2;
            
            if (insertAfter) {
                target.parentNode.insertBefore(this.draggedElement, target.nextSibling);
            } else {
                target.parentNode.insertBefore(this.draggedElement, target);
            }
            
            this.clearBuilderStatus();
        }
        
        // Clean up
        target?.classList.remove('drag-over');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        // Remove drag-over class from all elements
        this.intervalsContainer.querySelectorAll('.interval-card').forEach(card => {
            card.classList.remove('drag-over');
        });
        this.draggedElement = null;
    }
    
    generateFromBuilder() {
        const intervals = [];
        const intervalCards = this.intervalsContainer.querySelectorAll('.interval-card');
        
        intervalCards.forEach(card => {
            const label = card.querySelector('.label-input').value.trim();
            const time = card.querySelector('.time-input').value.trim();
            const notes = card.querySelector('.notes-input').value.trim();
            
            if (label && time) {
                const interval = { label, time };
                if (notes) {
                    interval.notes = notes;
                }
                intervals.push(interval);
            }
        });
        
        if (intervals.length === 0) {
            alert('Please add at least one interval');
            return;
        }
        
        // Sync cycle values
        this.customCyclesInput.value = this.builderCyclesInput.value;
        this.customTotalCycles = parseInt(this.builderCyclesInput.value);
        
        // Create timer data object with intervals and cycles
        const dayInput = document.getElementById('dayInput');
        const day = dayInput && dayInput.value ? parseInt(dayInput.value) : null;
        
        const timerData = {
            intervals,
            cycles: this.customTotalCycles
        };
        
        // Add day field if specified
        if (day !== null && !isNaN(day)) {
            timerData.day = day;
        }
        
        // Generate JSON and switch to JSON tab to show it
        const jsonString = JSON.stringify(timerData, null, 2);
        this.jsonInput.value = jsonString;
        
        // Load the timer
        this.loadFromJson();
        
        // Show success message
        this.jsonStatus.textContent = `✓ Loaded ${intervals.length} intervals successfully. You can also view this timer in Timer Builder.`;
        this.jsonStatus.className = 'json-status loaded';
        
        // Show builder status message
        this.builderStatus.textContent = `✓ Timer loaded! You can view this JSON string in "JSON Editor"`;
        this.builderStatus.className = 'builder-status success';
    }
    
    parseTimeToSeconds(timeValue) {
        if (typeof timeValue === 'number') {
            return timeValue; // Already in seconds
        }
        
        if (typeof timeValue !== 'string') {
            throw new Error('Time must be a number or string');
        }
        
        let totalSeconds = 0;
        const timeStr = timeValue.toLowerCase().trim();
        
        // Handle patterns like "1m 30s", "2 minutes 15 seconds", "45s", "2m", etc.
        const patterns = [
            // Minutes and seconds: "1m 30s", "1 minute 30 seconds"
            /(?:(\d+)\s*(?:m|min|minute|minutes))?(?:\s*(\d+)\s*(?:s|sec|second|seconds)?)?/,
        ];
        
        const match = timeStr.match(patterns[0]);
        if (match) {
            const minutes = parseInt(match[1] || 0);
            const seconds = parseInt(match[2] || 0);
            totalSeconds = minutes * 60 + seconds;
        }
        
        // If no match or result is 0, try to parse as pure number
        if (totalSeconds === 0) {
            const numMatch = timeStr.match(/(\d+)/);
            if (numMatch) {
                totalSeconds = parseInt(numMatch[1]);
            }
        }
        
        if (totalSeconds <= 0) {
            throw new Error('Invalid time format');
        }
        
        return totalSeconds;
    }

    validateJson() {
        const jsonText = this.jsonInput.value.trim();
        if (!jsonText) {
            this.jsonStatus.textContent = '';
            this.jsonStatus.className = 'json-status';
            return false;
        }
        
        try {
            const data = JSON.parse(jsonText);
            
            // Handle different JSON structures
            if (Array.isArray(data)) {
                // Could be array of intervals or array of day objects
                if (data.length === 0) {
                    throw new Error('JSON array cannot be empty');
                }
                
                // Check if first item has 'day' property (day-based structure)
                if (data[0].day !== undefined) {
                    // Validate day-based structure
                    for (let i = 0; i < data.length; i++) {
                        const dayObj = data[i];
                        
                        if (typeof dayObj.day !== 'number') {
                            throw new Error(`Day object ${i + 1}: 'day' must be a number`);
                        }
                        
                        if (!dayObj.intervals || !Array.isArray(dayObj.intervals)) {
                            throw new Error(`Day object ${i + 1}: 'intervals' must be an array`);
                        }
                        
                        if (dayObj.cycles && typeof dayObj.cycles !== 'number') {
                            throw new Error(`Day object ${i + 1}: 'cycles' must be a number`);
                        }
                        
                        // Validate intervals within this day
                        for (let j = 0; j < dayObj.intervals.length; j++) {
                            const interval = dayObj.intervals[j];
                            if (!interval.label || typeof interval.label !== 'string') {
                                throw new Error(`Day ${dayObj.day}, Interval ${j + 1}: 'label' is required and must be a string`);
                            }
                            if (!interval.time) {
                                throw new Error(`Day ${dayObj.day}, Interval ${j + 1}: 'time' is required`);
                            }
                            
                            // Validate time format
                            try {
                                this.parseTimeToSeconds(interval.time);
                            } catch (timeError) {
                                throw new Error(`Day ${dayObj.day}, Interval ${j + 1}: ${timeError.message}`);
                            }
                        }
                    }
                    
                    const totalDays = data.length;
                    const totalIntervals = data.reduce((sum, dayObj) => sum + dayObj.intervals.length, 0);
                    this.jsonStatus.textContent = `✓ Valid multi-day JSON with ${totalDays} days and ${totalIntervals} total intervals`;
                    this.jsonStatus.className = 'json-status success';
                    return true;
                } else {
                    // Simple interval array
                    for (let i = 0; i < data.length; i++) {
                        const interval = data[i];
                        if (!interval.label || typeof interval.label !== 'string') {
                            throw new Error(`Interval ${i + 1}: 'label' is required and must be a string`);
                        }
                        if (!interval.time) {
                            throw new Error(`Interval ${i + 1}: 'time' is required`);
                        }
                        
                        // Validate time format
                        try {
                            this.parseTimeToSeconds(interval.time);
                        } catch (timeError) {
                            throw new Error(`Interval ${i + 1}: ${timeError.message}`);
                        }
                    }
                    
                    this.jsonStatus.textContent = `✓ Valid JSON with ${data.length} intervals`;
                    this.jsonStatus.className = 'json-status success';
                    return true;
                }
            } else if (typeof data === 'object' && data !== null) {
                // Single day object
                if (typeof data.day !== 'number') {
                    throw new Error('Single day object: \'day\' must be a number');
                }
                
                if (!data.intervals || !Array.isArray(data.intervals)) {
                    throw new Error('Single day object: \'intervals\' must be an array');
                }
                
                                 if (data.cycles && typeof data.cycles !== 'number') {
                     throw new Error('Single day object: \'cycles\' must be a number');
                 }
                
                // Validate intervals
                for (let i = 0; i < data.intervals.length; i++) {
                    const interval = data.intervals[i];
                    if (!interval.label || typeof interval.label !== 'string') {
                        throw new Error(`Day ${data.day}, Interval ${i + 1}: 'label' is required and must be a string`);
                    }
                    if (!interval.time) {
                        throw new Error(`Day ${data.day}, Interval ${i + 1}: 'time' is required`);
                    }
                    
                    // Validate time format
                    try {
                        this.parseTimeToSeconds(interval.time);
                    } catch (timeError) {
                        throw new Error(`Day ${data.day}, Interval ${i + 1}: ${timeError.message}`);
                    }
                }
                
                this.jsonStatus.textContent = `✓ Valid day ${data.day} JSON with ${data.intervals.length} intervals`;
                this.jsonStatus.className = 'json-status success';
                return true;
            } else {
                throw new Error('JSON must be an array of intervals, array of day objects, or a single day object');
            }
        } catch (error) {
            this.jsonStatus.textContent = `✗ ${error.message}`;
            this.jsonStatus.className = 'json-status error';
            return false;
        }
    }
    
    loadFromJson() {
        const jsonText = this.jsonInput.value.trim();
        const dayInput = document.getElementById('dayInput');
        const specificDay = dayInput ? parseInt(dayInput.value) : null;
        
        if (!jsonText) {
            this.showJsonStatus('Please enter JSON data.', 'error');
            return;
        }

        try {
            let data = JSON.parse(jsonText);
            
            // Check if JSON contains day fields but no day is specified
            const hasNoDayInput = specificDay === null || isNaN(specificDay);
            const jsonHasDayFields = (Array.isArray(data) && data.length > 0 && data[0].day !== undefined) || 
                                   (typeof data === 'object' && data !== null && data.day !== undefined);
            
            if (jsonHasDayFields && hasNoDayInput) {
                this.showJsonStatus('No day inputted but day field given in json', 'error');
                return;
            }
            
            // If specific day is requested, filter for that day
            if (specificDay !== null && !isNaN(specificDay)) {
                if (Array.isArray(data)) {
                    // Look for an object with the matching day
                    const dayData = data.find(item => item.day === specificDay);
                    if (dayData) {
                        data = dayData;
                    } else {
                        this.showJsonStatus(`No data found for day ${specificDay}.`, 'error');
                        return;
                    }
                } else if (data.day && data.day !== specificDay) {
                    this.showJsonStatus(`Data is for day ${data.day}, but you requested day ${specificDay}.`, 'error');
                    return;
                }
            }
            
            // Validate that data has the required structure
            if (!data.intervals || !Array.isArray(data.intervals)) {
                this.showJsonStatus('JSON must contain an "intervals" array.', 'error');
                return;
            }

            // Clear existing intervals
            this.workoutIntervals = [];
            this.customIntervals = [];
            this.intervalsContainer.innerHTML = '';

            // Load cycles if provided
            if (data.cycles && typeof data.cycles === 'number') {
                this.customCyclesInput.value = data.cycles;
            }

            // Load intervals
            data.intervals.forEach(interval => {
                if (interval.label && interval.time) {
                    // Add to builder interface
                    this.addInterval(interval.label, interval.time);
                    
                    // Add to customIntervals for the timer to use
                    this.customIntervals.push({
                        label: interval.label,
                        time: this.parseTimeToSeconds(interval.time),
                        notes: interval.notes || ''
                    });
                }
            });

            // Update total cycles
            this.customTotalCycles = parseInt(this.customCyclesInput.value);

            const dayText = specificDay ? ` for day ${specificDay}` : '';
            this.showJsonStatus(`✅ Timer loaded successfully${dayText}! (${data.intervals.length} intervals)`, 'success');
        } catch (error) {
            this.showJsonStatus('Invalid JSON format. Please check your data.', 'error');
        }
    }
    
    syncJsonToBuilder(rawIntervals = null) {
        if (!rawIntervals) {
            try {
                rawIntervals = JSON.parse(this.jsonInput.value.trim());
            } catch (error) {
                return; // Invalid JSON, can't sync
            }
        }
        
        // Clear existing intervals in builder
        this.intervalsContainer.innerHTML = '';
        this.intervalCounter = 0;
        
        // Add intervals from JSON to builder
        rawIntervals.forEach(interval => {
            const time = typeof interval.time === 'number' ? `${interval.time}s` : interval.time;
            this.addInterval(interval.label, time, interval.notes || '');
        });
        
        // Clear builder status
        this.clearBuilderStatus();
    }

    start() {
        if (!this.isRunning && !this.isPaused) {
            // Starting fresh
            if (this.isCustomMode) {
                if (this.customIntervals.length === 0) {
                    alert('Please load a custom workout first');
                    return;
                }
                this.currentIntervalIndex = 0;
                this.currentCustomCycle = 1;
                this.customTotalCycles = parseInt(this.customCyclesInput.value);
                this.timeRemaining = this.customIntervals[0].time;
            } else {
                this.currentCycle = 1;
                this.isWorkPhase = true;
                this.timeRemaining = this.workTime;
            }
        }
        
        this.isRunning = true;
        this.isPaused = false;
        
        this.startBtn.disabled = true;
        this.startMainBtn.disabled = true;
        this.startBuilderBtn.disabled = true;
        this.startJsonBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.skipBtn.disabled = false;
        
        // Disable controls during timer
        this.workTimeInput.disabled = true;
        this.restTimeInput.disabled = true;
        this.cyclesInput.disabled = true;
        this.jsonInput.disabled = true;
        this.loadJsonBtn.disabled = true;
        this.customCyclesInput.disabled = true;
        this.builderCyclesInput.disabled = true;
        this.simpleModeRadio.disabled = true;
        this.customModeRadio.disabled = true;
        this.unitButtons.forEach(btn => btn.disabled = true);
        this.pomodoroBtn.disabled = true;
        
        // Disable builder interface
        this.addIntervalBtn.disabled = true;
        this.generateJsonBtn.disabled = true;
        this.builderTab.disabled = true;
        this.jsonTab.disabled = true;
        this.intervalsContainer.querySelectorAll('input, button').forEach(el => el.disabled = true);
        
        this.timerInterval = setInterval(() => {
            this.tick();
        }, 1000);
        
        this.updateDisplay();
    }
    
    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            
            clearInterval(this.timerInterval);
            
            this.startBtn.disabled = false;
            this.startMainBtn.disabled = false;
            this.startBuilderBtn.disabled = false;
            this.startJsonBtn.disabled = false;
            this.pauseBtn.disabled = true;
            this.skipBtn.disabled = true;
            
            this.updatePhaseIndicator();
        }
    }
    
    skip() {
        if (this.isRunning) {
            // Skip to next phase
            this.completePhase();
            this.updateDisplay();
        }
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.currentCycle = 0;
        this.currentIntervalIndex = 0;
        this.currentCustomCycle = 1;
        this.isWorkPhase = true;
        this.timeRemaining = 0;
        
        clearInterval(this.timerInterval);
        
        this.startBtn.disabled = false;
        this.startMainBtn.disabled = false;
        this.startBuilderBtn.disabled = false;
        this.startJsonBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.skipBtn.disabled = true;
        
        // Re-enable controls
        this.workTimeInput.disabled = false;
        this.restTimeInput.disabled = false;
        this.cyclesInput.disabled = false;
        this.jsonInput.disabled = false;
        this.loadJsonBtn.disabled = false;
        this.customCyclesInput.disabled = false;
        this.builderCyclesInput.disabled = false;
        this.simpleModeRadio.disabled = false;
        this.customModeRadio.disabled = false;
        this.unitButtons.forEach(btn => btn.disabled = false);
        this.pomodoroBtn.disabled = false;
        
        // Re-enable builder interface
        this.addIntervalBtn.disabled = false;
        this.generateJsonBtn.disabled = false;
        this.builderTab.disabled = false;
        this.jsonTab.disabled = false;
        this.intervalsContainer.querySelectorAll('input, button').forEach(el => el.disabled = false);
        
        // Hide workout completion modal
        this.modalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
        this.generatedJsonSection.style.display = 'none';
        
        this.updateDisplay();
    }
    
    tick() {
        this.timeRemaining--;
        
        if (this.timeRemaining <= 0) {
            this.completePhase();
        }
        
        this.updateDisplay();
    }
    
    completePhase() {
        // Play notification sound (if available)
        this.playNotificationSound();
        
        if (this.isCustomMode) {
            // Check if we're at the last interval of current cycle
            if (this.currentIntervalIndex >= this.customIntervals.length - 1) {
                // All intervals in current cycle completed
                this.currentCustomCycle++;
                
                if (this.currentCustomCycle > this.customTotalCycles) {
                    // All cycles completed
                    this.completeWorkout();
                    return;
                }
                
                // Start next cycle
                this.currentIntervalIndex = 0;
                this.timeRemaining = this.customIntervals[0].time;
            } else {
                // Move to next interval in current cycle
                this.currentIntervalIndex++;
                this.timeRemaining = this.customIntervals[this.currentIntervalIndex].time;
            }
        } else {
            if (this.isWorkPhase) {
                // Work phase completed, switch to rest
                this.isWorkPhase = false;
                this.timeRemaining = this.restTime;
            } else {
                // Rest phase completed, move to next cycle
                this.currentCycle++;
                
                if (this.currentCycle > this.totalCycles) {
                    // All cycles completed
                    this.completeWorkout();
                    return;
                }
                
                this.isWorkPhase = true;
                this.timeRemaining = this.workTime;
            }
        }
    }
    
    completeWorkout() {
        this.isRunning = false;
        this.isPaused = false;
        
        clearInterval(this.timerInterval);
        
        // Store the completed workout data
        this.lastCompletedWorkout = this.captureWorkoutData();
        
        this.startBtn.disabled = false;
        this.startMainBtn.disabled = false;
        this.startBuilderBtn.disabled = false;
        this.startJsonBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.skipBtn.disabled = true;
        
        // Re-enable controls
        this.workTimeInput.disabled = false;
        this.restTimeInput.disabled = false;
        this.cyclesInput.disabled = false;
        this.jsonInput.disabled = false;
        this.loadJsonBtn.disabled = false;
        this.customCyclesInput.disabled = false;
        this.builderCyclesInput.disabled = false;
        this.simpleModeRadio.disabled = false;
        this.customModeRadio.disabled = false;
        this.unitButtons.forEach(btn => btn.disabled = false);
        this.pomodoroBtn.disabled = false;
        
        // Re-enable builder interface
        this.addIntervalBtn.disabled = false;
        this.generateJsonBtn.disabled = false;
        this.builderTab.disabled = false;
        this.jsonTab.disabled = false;
        this.intervalsContainer.querySelectorAll('input, button').forEach(el => el.disabled = false);
        
        this.phaseIndicator.textContent = 'Timer Complete!';
        this.phaseIndicator.className = 'phase-indicator finished';
        
        // Show workout completion modal
        this.modalOverlay.style.display = 'flex';
        document.body.classList.add('modal-active');
        
        // Flash the display
        this.flashDisplay();
        
        // Play notification sound
        this.playNotificationSound();
    }
    
    updateDisplay() {
        // Update time display
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Update phase indicator
        this.updatePhaseIndicator();
        
        // Update cycle counter - show intervals within current cycle only
        if (this.isCustomMode) {
            // Check if workout is complete
            const isWorkoutComplete = this.currentCustomCycle > this.customTotalCycles;
            
            if (!this.isRunning && !this.isPaused && this.currentIntervalIndex === 0 && this.currentCustomCycle === 1) {
                this.currentCycleSpan.textContent = 0;
            } else if (isWorkoutComplete) {
                // Show final state: all intervals completed
                this.currentCycleSpan.textContent = this.customIntervals.length;
            } else {
                // Show current interval within the cycle (1-based)
                const safeIntervalIndex = Math.min(this.currentIntervalIndex, this.customIntervals.length - 1);
                this.currentCycleSpan.textContent = safeIntervalIndex + 1;
            }
            this.totalCyclesSpan.textContent = this.customIntervals.length;
            
            // Update customTotalCycles from input if not running
            if (!this.isRunning) {
                this.customTotalCycles = parseInt(this.customCyclesInput.value);
            }
            
            // Show/hide workout cycle counter
            if (this.customTotalCycles > 1) {
                this.cycleCounter.style.display = 'block';
                // Handle completion state for cycle counter
                if (isWorkoutComplete) {
                    this.currentWorkoutCycleSpan.textContent = this.customTotalCycles;
                } else {
                    this.currentWorkoutCycleSpan.textContent = this.currentCustomCycle;
                }
                this.totalWorkoutCyclesSpan.textContent = this.customTotalCycles;
            } else {
                this.cycleCounter.style.display = 'none';
            }
        } else {
            // Hide workout cycle counter in simple mode
            this.cycleCounter.style.display = 'none';
            
            // Simple mode: show completed cycles out of total cycles
            let completedCycles = 0;
            
            if (this.currentCycle > 0) {
                // A cycle is completed when both work and rest phases are done
                completedCycles = this.currentCycle - 1;
            }
            
            this.currentCycleSpan.textContent = completedCycles;
            this.totalCyclesSpan.textContent = this.totalCycles;
        }
        
        // Update progress bar
        this.updateProgressBar();
    }
    
    updatePhaseIndicator() {
        if (!this.isRunning && !this.isPaused && (this.currentCycle === 0 || (this.isCustomMode && this.currentIntervalIndex === 0))) {
            this.phaseIndicator.textContent = 'Ready to Start';
            this.phaseIndicator.className = 'phase-indicator ready';
        } else if (this.isPaused) {
            if (this.isCustomMode && this.customIntervals.length > 0) {
                const safeIntervalIndex = Math.min(this.currentIntervalIndex, this.customIntervals.length - 1);
                const currentInterval = this.customIntervals[safeIntervalIndex];
                let displayText = currentInterval.label;
                if (currentInterval.notes) {
                    displayText += ` (${currentInterval.notes})`;
                }
                this.phaseIndicator.textContent = `Paused - ${displayText}`;
                this.phaseIndicator.className = 'phase-indicator work'; // Default to work styling for custom
            } else {
                this.phaseIndicator.textContent = `Paused - ${this.isWorkPhase ? 'Work' : 'Rest'} Phase`;
                this.phaseIndicator.className = `phase-indicator ${this.isWorkPhase ? 'work' : 'rest'}`;
            }
        } else if (this.isCustomMode && this.customIntervals.length > 0) {
            const safeIntervalIndex = Math.min(this.currentIntervalIndex, this.customIntervals.length - 1);
            const currentInterval = this.customIntervals[safeIntervalIndex];
            let displayText = currentInterval.label;
            if (currentInterval.notes) {
                displayText += ` (${currentInterval.notes})`;
            }
            this.phaseIndicator.textContent = displayText;
            // Determine if it's a rest interval based on label content
            const isRest = currentInterval.label.toLowerCase().includes('rest') || 
                          currentInterval.label.toLowerCase().includes('break');
            this.phaseIndicator.className = `phase-indicator ${isRest ? 'rest' : 'work'}`;
        } else if (this.isWorkPhase) {
            this.phaseIndicator.textContent = 'Work Time';
            this.phaseIndicator.className = 'phase-indicator work';
        } else {
            this.phaseIndicator.textContent = 'Rest Time';
            this.phaseIndicator.className = 'phase-indicator rest';
        }
    }
    
    updateProgressBar() {
        if (this.isCustomMode) {
            // Custom mode: progress based on intervals within current cycle only
            if (this.customIntervals.length === 0 || (!this.isRunning && !this.isPaused && this.currentCustomCycle === 1)) {
                this.progressFill.style.width = '0%';
                return;
            }
            
            // Check if workout is complete
            const isWorkoutComplete = this.currentCustomCycle > this.customTotalCycles;
            if (isWorkoutComplete) {
                this.progressFill.style.width = '100%';
                return;
            }
            
            const totalIntervalsInCycle = this.customIntervals.length;
            
            // Calculate completed intervals within current cycle
            const safeIntervalIndex = Math.min(this.currentIntervalIndex, this.customIntervals.length - 1);
            let completedIntervals = safeIntervalIndex;
            
            // Add progress for current interval (only if we're actually running)
            let currentIntervalProgress = 0;
            if (this.isRunning && safeIntervalIndex < this.customIntervals.length) {
                const currentInterval = this.customIntervals[safeIntervalIndex];
                currentIntervalProgress = (currentInterval.time - this.timeRemaining) / currentInterval.time;
            }
            
            const totalProgress = (completedIntervals + currentIntervalProgress) / totalIntervalsInCycle;
            const progress = totalProgress * 100;
            
            this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        } else {
            // Simple mode: progress based on cycles completed
            if (this.currentCycle === 0) {
                this.progressFill.style.width = '0%';
                return;
            }
            
            let completedCycles = this.currentCycle - 1;
            let currentCycleProgress = 0;
            
            // Calculate progress within current cycle
            if (this.isWorkPhase) {
                // In work phase, no cycle is complete yet
                currentCycleProgress = (this.workTime - this.timeRemaining) / (this.workTime + this.restTime);
            } else {
                // In rest phase, work is done, now progressing through rest
                const workProgress = this.workTime / (this.workTime + this.restTime);
                const restProgress = (this.restTime - this.timeRemaining) / (this.workTime + this.restTime);
                currentCycleProgress = workProgress + restProgress;
            }
            
            const totalProgress = (completedCycles + currentCycleProgress) / this.totalCycles;
            const progress = totalProgress * 100;
            
            this.progressFill.style.width = `${Math.min(progress, 100)}%`;
        }
    }
    
    playNotificationSound() {
        // Create a simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.log('Audio notification not available');
        }
    }
    
    flashDisplay() {
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            if (flashCount % 2 === 0) {
                this.timeDisplay.style.color = '#f39c12';
            } else {
                this.timeDisplay.style.color = '#3498db';
            }
            
            flashCount++;
            if (flashCount >= 6) {
                clearInterval(flashInterval);
                this.timeDisplay.style.color = '#3498db';
            }
        }, 200);
    }
    
    // Data Visualization Functions
    generateChart() {
        const input = this.vizJsonInput.value.trim();
        
        if (!input) {
            this.showVizStatus('Please enter timer data to generate a chart.', 'error');
            return;
        }
        
        try {
            const { data, otherNotes } = this.parseVisualizationData(input);
            
            if (data.length === 0) {
                this.showVizStatus('No valid data found. Please check your format.', 'error');
                return;
            }
            
            this.createWorkoutChart(data, otherNotes);
            this.showVizStatus(`Chart generated successfully with ${data.length} data points!`, 'success');
        } catch (error) {
            this.showVizStatus(`Error generating chart: ${error.message}`, 'error');
        }
    }
    
    clearChart() {
        if (this.currentChart) {
            this.currentChart.destroy();
            this.currentChart = null;
        }
        this.chartContainer.style.display = 'none';
        this.showVizStatus('Chart cleared.', 'success');
    }
    
    parseVisualizationData(input) {
        const lines = input.trim().split('\n');
        const data = [];
        let currentDate = null;
        let otherNotes = []; // Store other notes/comments
        let jsonBuffer = ''; // Buffer for multi-line JSON
        let inJsonArray = false;
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            // Check for comments (other notes)
            if (line.startsWith('//')) {
                const note = line.substring(2).trim();
                if (note) {
                    otherNotes.push(note);
                }
                continue;
            }
            
            // Check for date line
            if (line.startsWith('date:')) {
                // Process any pending JSON data
                if (currentDate && jsonBuffer.trim()) {
                    try {
                        const intervals = JSON.parse(jsonBuffer.trim());
                        if (Array.isArray(intervals)) {
                            data.push({
                                date: currentDate,
                                intervals: intervals
                            });
                        }
                    } catch (error) {
                        console.warn('Could not parse JSON buffer:', jsonBuffer);
                    }
                }
                
                // Reset for new date
                jsonBuffer = '';
                inJsonArray = false;
                
                // Extract new date
                const dateMatch = line.match(/date:\s*"([^"]+)"/);
                if (dateMatch) {
                    currentDate = dateMatch[1];
                } else {
                    console.warn('Could not parse date from line:', line);
                }
                continue;
            }
            
            // Handle JSON array lines
            if (line.startsWith('[')) {
                inJsonArray = true;
                jsonBuffer = line;
                
                // Check if it's a single-line JSON array
                if (line.endsWith(']')) {
                    inJsonArray = false;
                    try {
                        const intervals = JSON.parse(jsonBuffer);
                        if (Array.isArray(intervals) && currentDate) {
                            data.push({
                                date: currentDate,
                                intervals: intervals
                            });
                        }
                    } catch (error) {
                        console.warn('Could not parse single-line JSON:', jsonBuffer);
                    }
                    jsonBuffer = '';
                }
                continue;
            }
            
            // Continue building multi-line JSON
            if (inJsonArray) {
                jsonBuffer += line;
                
                // Check if we've reached the end of the JSON array
                if (line.endsWith(']')) {
                    inJsonArray = false;
                    try {
                        const intervals = JSON.parse(jsonBuffer);
                        if (Array.isArray(intervals) && currentDate) {
                            data.push({
                                date: currentDate,
                                intervals: intervals
                            });
                        }
                    } catch (error) {
                        console.warn('Could not parse multi-line JSON:', jsonBuffer);
                    }
                    jsonBuffer = '';
                }
            }
        }
        
        // Process any remaining JSON data
        if (currentDate && jsonBuffer.trim()) {
            try {
                const intervals = JSON.parse(jsonBuffer.trim());
                if (Array.isArray(intervals)) {
                    data.push({
                        date: currentDate,
                        intervals: intervals
                    });
                }
            } catch (error) {
                console.warn('Could not parse final JSON buffer:', jsonBuffer);
            }
        }
        
        console.log('Parsed data:', data);
        console.log('Other notes:', otherNotes);
        return { data, otherNotes };
    }
    
    createWorkoutChart(data, otherNotes = []) {
        // Clear any existing chart
        if (this.currentChart) {
            this.currentChart.destroy();
        }
        
        // Show chart container
        this.chartContainer.style.display = 'block';
        
        // Get unique exercise labels (excluding "Rest")
        const allLabels = new Set();
        data.forEach(dayData => {
            dayData.intervals.forEach(interval => {
                if (interval.label.toLowerCase() !== 'rest') {
                    allLabels.add(interval.label);
                }
            });
        });
        
        // Generate colors for each exercise
        const colors = [
            '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', 
            '#1abc9c', '#34495e', '#e67e22', '#95a5a6', '#f1c40f'
        ];
        
        // Create datasets for each exercise
        const datasets = Array.from(allLabels).map((label, index) => {
            const color = colors[index % colors.length];
            
            // Get data points for this exercise across all dates
            const points = data.map(dayData => {
                const interval = dayData.intervals.find(int => int.label === label);
                if (!interval) return null;
                
                let yValue;
                if (interval.notes && !isNaN(parseFloat(interval.notes))) {
                    // Use notes value if it's a number
                    yValue = parseFloat(interval.notes);
                } else {
                    // Parse time duration
                    yValue = this.parseTimeToSeconds(interval.time);
                }
                
                return {
                    x: dayData.date,
                    y: yValue,
                    originalData: interval // Store original data for tooltips
                };
            }).filter(point => point !== null);
            
            return {
                label: label,
                data: points,
                borderColor: color,
                backgroundColor: color + '20',
                fill: false,
                tension: 0.1,
                pointRadius: 6,
                pointHoverRadius: 8
            };
        });
        
        const ctx = this.workoutChart.getContext('2d');
        
        // Create caption text from other notes
        let captionText = '';
        if (otherNotes.length > 0) {
            captionText = otherNotes.join(' • ');
        }
        
        this.currentChart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            parser: 'yyyy-MM-dd',
                            displayFormats: {
                                day: 'MMM dd'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Timer Progress Over Time'
                    },
                    subtitle: {
                        display: captionText.length > 0,
                        text: captionText,
                        font: {
                            size: 12,
                            style: 'italic'
                        },
                        color: '#666'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const point = context.raw;
                                const interval = point.originalData;
                                
                                let value;
                                if (interval.notes && !isNaN(parseFloat(interval.notes))) {
                                    value = interval.notes;
                                } else {
                                    value = interval.time;
                                }
                                
                                let tooltip = `${context.dataset.label}: ${value}`;
                                if (interval.notes && isNaN(parseFloat(interval.notes))) {
                                    tooltip += ` (${interval.notes})`;
                                }
                                
                                return tooltip;
                            }
                        }
                    }
                }
            }
        });
    }
    
    showVizStatus(message, type) {
        this.vizStatus.textContent = message;
        this.vizStatus.className = `viz-status ${type}`;
        this.vizStatus.style.display = 'block';
        
        // Auto-hide success messages after 3 seconds
        if (type === 'success') {
            setTimeout(() => {
                this.vizStatus.style.display = 'none';
            }, 3000);
        }
    }
    
    // Workout Completion Functions
    captureWorkoutData() {
        const today = new Date().toISOString().split('T')[0];
        
        if (this.isCustomMode && this.customIntervals.length > 0) {
            // Capture custom workout data
            return {
                date: today,
                intervals: this.customIntervals.map(interval => ({
                    label: interval.label,
                    time: this.formatSecondsToTimeString(interval.time),
                    notes: interval.notes || undefined
                }))
            };
        } else {
            // Capture simple mode workout data
            const intervals = [];
            for (let i = 0; i < this.totalCycles; i++) {
                intervals.push({
                    label: "Work",
                    time: this.formatSecondsToTimeString(this.workTime)
                });
                intervals.push({
                    label: "Rest", 
                    time: this.formatSecondsToTimeString(this.restTime)
                });
            }
            return {
                date: today,
                intervals: intervals
            };
        }
    }
    
    formatSecondsToTimeString(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            if (remainingSeconds > 0) {
                return `${minutes}m ${remainingSeconds}s`;
            } else {
                return `${minutes}m`;
            }
        } else {
            return `${remainingSeconds}s`;
        }
    }
    
    generateWorkoutJson() {
        if (!this.lastCompletedWorkout) {
            alert('No timer data available.');
            return;
        }
        
        // Show other notes section
        this.otherNotesSection.style.display = 'block';
        
        const jsonString = `date: "${this.lastCompletedWorkout.date}"\n` +
            JSON.stringify(this.lastCompletedWorkout.intervals, null, 2);
        
        this.generatedJsonOutput.value = jsonString;
        this.generatedJsonSection.style.display = 'block';
    }
    
    dismissWorkoutComplete() {
        this.modalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
        this.generatedJsonSection.style.display = 'none';
        this.otherNotesSection.style.display = 'none';
        this.otherNotesInput.value = '';
        this.lastCompletedWorkout = null;
    }
    
    copyJsonToClipboard() {
        if (!this.generatedJsonOutput.value) {
            alert('No JSON data to copy.');
            return;
        }
        
        // Get the other notes if provided
        const otherNotes = this.otherNotesInput.value.trim();
        let dataToCopy = this.generatedJsonOutput.value;
        
        // Add other notes as a comment if provided
        if (otherNotes) {
            dataToCopy = `// ${otherNotes}\n${dataToCopy}`;
        }
        
        // Create a temporary textarea to copy the data
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = dataToCopy;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        tempTextarea.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            alert('Timer data copied to clipboard!');
        } catch (err) {
            // Fallback for modern browsers
            navigator.clipboard.writeText(dataToCopy).then(() => {
                alert('Timer data copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy to clipboard. Please copy manually.');
            });
        }
        
        // Clean up
        document.body.removeChild(tempTextarea);
    }
    
    addJsonToVisualization() {
        if (!this.generatedJsonOutput.value) {
            alert('No JSON data to add.');
            return;
        }
        
        // Switch to visualization mode
        this.visualizationModeRadio.checked = true;
        this.switchMode();
        
        // Get the other notes if provided
        const otherNotes = this.otherNotesInput.value.trim();
        let dataToAdd = this.generatedJsonOutput.value;
        
        // Add other notes as a comment if provided
        if (otherNotes) {
            dataToAdd = `// ${otherNotes}\n${dataToAdd}`;
        }
        
        // Check if current data is the default data
        const currentVizData = this.vizJsonInput.value.trim();
        const defaultData = this.getDefaultVisualizationData();
        
        // If current data is default data, replace it. Otherwise, append.
        if (currentVizData === defaultData) {
            this.vizJsonInput.value = dataToAdd;
        } else if (currentVizData) {
            this.vizJsonInput.value = currentVizData + '\n\n' + dataToAdd;
        } else {
            this.vizJsonInput.value = dataToAdd;
        }
        
        // Dismiss the completion section
        this.dismissWorkoutComplete();
        
        alert('Timer data added to visualization! You can now generate a chart.');
    }
    
    getDefaultVisualizationData() {
        return `// Squats record tracking - pounds squatted
date: "2025-07-01"
[
  {"label": "Push-ups", "time": "45s"},
  {"label": "Rest", "time": "15s"},
  {"label": "Squats", "time": "1m 30s", "notes": "45"},
  {"label": "Rest", "time": "20s"},
  {"label": "Burpees", "time": "2m", "notes": "5"},
  {"label": "Rest", "time": "15s"}
]

// Week 2 - increased weights and reps
date: "2025-07-05"
[
  {"label": "Push-ups", "time": "45s"},
  {"label": "Rest", "time": "15s"},
  {"label": "Squats", "time": "1m 30s", "notes": "95"},
  {"label": "Rest", "time": "20s"},
  {"label": "Burpees", "time": "2m", "notes": "8"},
  {"label": "Rest", "time": "15s"}
]`;
    }
    
    clearVisualizationData() {
        if (confirm('Are you sure you want to clear all visualization data? This cannot be undone.')) {
            this.vizJsonInput.value = '';
            this.showVizStatus('Visualization data cleared.', 'success');
            
            // Also clear any existing chart
            if (this.currentChart) {
                this.currentChart.destroy();
                this.currentChart = null;
                this.chartContainer.style.display = 'none';
            }
        }
    }
    
    showVisualizationHelp() {
        this.helpModalOverlay.style.display = 'flex';
        document.body.classList.add('modal-active');
    }
    
    closeVisualizationHelp() {
        this.helpModalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
    
    showSimpleHelp() {
        this.simpleHelpModalOverlay.style.display = 'flex';
        document.body.classList.add('modal-active');
    }
    
    closeSimpleHelp() {
        this.simpleHelpModalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
    
    showCustomHelp() {
        this.customHelpModalOverlay.style.display = 'flex';
        document.body.classList.add('modal-active');
    }
    
    closeCustomHelp() {
        this.customHelpModalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
    
    showDayHelp() {
        this.dayHelpModalOverlay.style.display = 'flex';
        document.body.classList.add('modal-active');
    }
    
    closeDayHelp() {
        this.dayHelpModalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
    
    closeWelcome() {
        this.welcomeModalOverlay.style.display = 'none';
        document.body.classList.remove('modal-active');
    }
    
    startSimpleMode() {
        this.simpleModeRadio.checked = true;
        this.customModeRadio.checked = false;
        this.visualizationModeRadio.checked = false;
        this.switchMode();
        this.closeWelcome();
    }
    
    startCustomMode() {
        this.customModeRadio.checked = true;
        this.simpleModeRadio.checked = false;
        this.visualizationModeRadio.checked = false;
        this.switchMode();
        this.closeWelcome();
    }
    
    startVisualizationMode() {
        this.visualizationModeRadio.checked = true;
        this.switchMode();
        this.closeWelcome();
    }
    
    copyExampleJson() {
        const exampleJson = `[
  {
    "day": 1,
    "intervals": [
      {"label": "Push-ups", "time": "30s"},
      {"label": "Rest", "time": "15s"},
      {"label": "Squats", "time": "45s"}
    ],
    "cycles": 3
  },
  {
    "day": 2,
    "intervals": [
      {"label": "Burpees", "time": "20s"},
      {"label": "Rest", "time": "10s"},
      {"label": "Cardio", "time": "2m"}
    ],
    "cycles": 4
  }
]`;
        
        // Create a temporary textarea to copy the data
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = exampleJson;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        tempTextarea.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            alert('Multi-day JSON example copied to clipboard!');
        } catch (err) {
            // Fallback for modern browsers
            navigator.clipboard.writeText(exampleJson).then(() => {
                alert('Multi-day JSON example copied to clipboard!');
            }).catch(() => {
                alert('Failed to copy to clipboard. Please copy manually.');
            });
        }
        
        // Clean up
        document.body.removeChild(tempTextarea);
    }
    
    showJsonStatus(message, type) {
        this.jsonStatus.textContent = message;
        this.jsonStatus.className = `json-status ${type}`;
    }
    
    clearJson() {
        if (confirm('Are you sure you want to clear the JSON? This cannot be undone.')) {
            this.jsonInput.value = '';
            this.showJsonStatus('JSON cleared.', 'success');
            
            // Clear day input as well
            const dayInput = document.getElementById('dayInput');
            if (dayInput) {
                dayInput.value = '';
            }
            
            // Clear existing intervals
            this.workoutIntervals = [];
            this.intervalsContainer.innerHTML = '';
        }
    }
}

// Initialize the timer when the page loads
let timer;
document.addEventListener('DOMContentLoaded', () => {
    timer = new IntervalTimer();
    // Show welcome modal on first load
    document.body.classList.add('modal-active');
});

// Prevent the page from being unloaded accidentally during a workout
window.addEventListener('beforeunload', (event) => {
    const timer = document.querySelector('.container');
    const startBtn = document.getElementById('startBtn');
    
    if (startBtn && startBtn.disabled) {
        event.preventDefault();
        event.returnValue = '';
        return '';
    }
}); 
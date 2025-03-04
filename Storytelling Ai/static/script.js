const storyForm = document.getElementById('storyForm');
        const generateBtn = document.getElementById('generateBtn');
        const promptInput = document.getElementById('prompt');
        const wordLimitInput = document.getElementById('word_limit');
        const wordLimitCounter = document.getElementById('wordLimitCounter');
        const genreSelect = document.getElementById('genre');
        const loading = document.getElementById('loading');
        const soundSwitch = document.getElementById('soundSwitch');
        const clickSound = document.getElementById('clickSound');
        const whooshSound = document.getElementById('whooshSound');
        
        // Word limit counter
        wordLimitInput.addEventListener('input', function() {
            wordLimitCounter.textContent = this.value || 0;
        });
        
        // Prompt validation
        promptInput.addEventListener('input', function() {
            if (this.value.length < 5) {
                this.classList.add('invalid');
            } else {
                this.classList.remove('invalid');
            }
        });
        
        // Form submission
        storyForm.addEventListener('submit', function(event) {
            const wordLimit = wordLimitInput.value;
            if (wordLimit < 10 || wordLimit > 1000) {
                event.preventDefault();
                alert('Word limit must be between 10 and 1000!');
                return;
            }
            if (promptInput.value.length < 5) {
                event.preventDefault();
                alert('Prompt must be at least 5 characters!');
                return;
            }
            generateBtn.classList.add('disabled');
            generateBtn.textContent = 'Generating...';
            loading.style.display = 'block';
            if (soundSwitch.checked) clickSound.play();
        });
        
        // Download button
        document.getElementById('downloadBtn')?.addEventListener('click', function() {
            if (soundSwitch.checked) whooshSound.play();
        });
        
        // Genre tooltips
        let tooltip = null;
        genreSelect.addEventListener('mouseover', function(event) {
            if (event.target.tagName === 'OPTION') return;
            const selectedOption = this.options[this.selectedIndex];
            const desc = selectedOption.dataset.desc;
            if (!desc) return;
        
            if (!tooltip) {
                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                document.body.appendChild(tooltip);
            }
            tooltip.textContent = desc;
            tooltip.style.left = `${event.pageX + 10}px`;
            tooltip.style.top = `${event.pageY + 10}px`;
            tooltip.classList.add('visible');
        });
        
        genreSelect.addEventListener('mouseout', function() {
            if (tooltip) tooltip.classList.remove('visible');
        });
        
        genreSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            console.log(selectedOption.dataset.desc); // Optional logging
        });
        
        // Reset button state after page load (if story exists)
        window.addEventListener('load', function() {
            generateBtn.classList.remove('disabled');
            generateBtn.textContent = 'Generate Now';
            loading.style.display = 'none';
        });
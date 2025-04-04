document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const textInput = document.getElementById('text-input');
  const voiceDescription = document.getElementById('voice-description');
  const useDescriptionRadio = document.getElementById('use-description');
  const useSavedVoiceRadio = document.getElementById('use-saved-voice');
  const savedVoicesSelect = document.getElementById('saved-voices');
  const refreshVoicesButton = document.getElementById('refresh-voices');
  const generateButton = document.getElementById('generate-button');
  const audioPlayer = document.getElementById('audio-player');
  const resultsSection = document.querySelector('.results');
  const voiceNameInput = document.getElementById('voice-name');
  const saveVoiceButton = document.getElementById('save-voice-button');
  const historyList = document.getElementById('history-list');
  const descriptionGroup = document.querySelector('.description-group');
  const savedVoiceGroup = document.querySelector('.saved-voice-group');

  // State
  let currentGenerationId = null;
  let history = [];

  // Toggle between voice description and saved voice
  useDescriptionRadio.addEventListener('change', function() {
    if (this.checked) {
      descriptionGroup.classList.remove('disabled');
      savedVoiceGroup.classList.add('disabled');
      savedVoicesSelect.disabled = true;
    }
  });

  useSavedVoiceRadio.addEventListener('change', function() {
    if (this.checked) {
      descriptionGroup.classList.add('disabled');
      savedVoiceGroup.classList.remove('disabled');
      savedVoicesSelect.disabled = false;
      loadVoices();
    }
  });

  // Load saved voices
  async function loadVoices() {
    try {
      const response = await fetch('/api/voices');
      if (!response.ok) throw new Error('Failed to load voices');
      
      const data = await response.json();
      
      if (data && data.voices && data.voices.length > 0) {
        // Clear current options
        savedVoicesSelect.innerHTML = '';
        
        // Add voices to select
        data.voices.forEach(voice => {
          const option = document.createElement('option');
          option.value = voice.name;
          option.textContent = voice.name;
          savedVoicesSelect.appendChild(option);
        });
      } else {
        savedVoicesSelect.innerHTML = '<option value="">No saved voices found</option>';
      }
    } catch (error) {
      console.error('Error loading voices:', error);
      savedVoicesSelect.innerHTML = '<option value="">Error loading voices</option>';
    }
  }

  // Refresh voices button
  refreshVoicesButton.addEventListener('click', loadVoices);

  // Generate speech
  generateButton.addEventListener('click', async function() {
    const text = textInput.value.trim();
    if (!text) {
      alert('Please enter some text to speak');
      return;
    }

    // Disable button during generation
    generateButton.disabled = true;
    generateButton.textContent = 'Generating...';

    try {
      // Prepare request data
      const useVoice = useSavedVoiceRadio.checked;
      const requestData = {
        text,
        useVoice
      };

      if (useVoice) {
        requestData.voiceName = savedVoicesSelect.value;
      } else {
        requestData.description = voiceDescription.value || 'A friendly, natural voice';
      }

      // Generate speech
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error('Failed to generate speech');
      
      const data = await response.json();
      
      // Store generation ID for saving voice later
      currentGenerationId = data.generationId;
      
      // Convert base64 audio to blob URL
      const audioBlob = base64ToBlob(data.audio, 'audio/wav');
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Update audio player
      audioPlayer.src = audioUrl;
      resultsSection.classList.remove('hidden');
      
      // Add to history
      addToHistory(text, audioUrl, requestData.description || requestData.voiceName);
      
      // Play audio
      audioPlayer.play();
    } catch (error) {
      console.error('Error generating speech:', error);
      alert('Error generating speech: ' + error.message);
    } finally {
      // Re-enable button
      generateButton.disabled = false;
      generateButton.textContent = 'Generate Speech';
    }
  });

  // Save voice button
  saveVoiceButton.addEventListener('click', async function() {
    if (!currentGenerationId) {
      alert('Please generate speech first');
      return;
    }

    const name = voiceNameInput.value.trim();
    if (!name) {
      alert('Please enter a name for this voice');
      return;
    }

    saveVoiceButton.disabled = true;
    saveVoiceButton.textContent = 'Saving...';

    try {
      const response = await fetch('/api/save-voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          generationId: currentGenerationId
        })
      });

      if (!response.ok) throw new Error('Failed to save voice');
      
      const data = await response.json();
      alert(data.message || 'Voice saved successfully');
      
      // Update the history item to show it's saved
      updateHistorySaved(currentGenerationId, name);
      
      // Refresh voices list
      loadVoices();
      
      // Clear input
      voiceNameInput.value = '';
    } catch (error) {
      console.error('Error saving voice:', error);
      alert('Error saving voice: ' + error.message);
    } finally {
      saveVoiceButton.disabled = false;
      saveVoiceButton.textContent = 'Save Voice';
    }
  });

  // Helper function to convert base64 to Blob
  function base64ToBlob(base64, mimeType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  }

  // Add item to history
  function addToHistory(text, audioUrl, voiceInfo) {
    // Create history item object
    const historyItem = {
      id: Date.now().toString(),
      text,
      audioUrl,
      voiceInfo,
      timestamp: new Date(),
      generationId: currentGenerationId,
      saved: false
    };
    
    // Add to history array
    history.unshift(historyItem);
    
    // Update UI
    updateHistoryUI();
  }

  // Update saved status in history
  function updateHistorySaved(generationId, voiceName) {
    for (const item of history) {
      if (item.generationId === generationId) {
        item.saved = true;
        item.savedName = voiceName;
        break;
      }
    }
    
    // Update UI
    updateHistoryUI();
  }

  // Update history UI
  function updateHistoryUI() {
    if (history.length === 0) {
      historyList.innerHTML = '<p class="empty-message">No generations yet</p>';
      return;
    }
    
    // Clear current history
    historyList.innerHTML = '';
    
    // Add history items
    history.forEach(item => {
      const historyItem = document.createElement('div');
      historyItem.className = 'history-item';
      historyItem.dataset.id = item.id;
      
      // Format timestamp
      const timeFormatted = item.timestamp.toLocaleTimeString();
      
      // Create time element
      const timeElement = document.createElement('div');
      timeElement.className = 'time';
      timeElement.textContent = timeFormatted;
      
      // Create text element
      const textElement = document.createElement('div');
      textElement.className = 'text';
      textElement.textContent = item.text.length > 50 
        ? item.text.substring(0, 50) + '...' 
        : item.text;
      
      // Add saved tag if saved
      if (item.saved) {
        const savedTag = document.createElement('span');
        savedTag.className = 'saved-voice-tag';
        savedTag.textContent = `Saved as: ${item.savedName}`;
        textElement.appendChild(savedTag);
      }
      
      // Append elements to history item
      historyItem.appendChild(timeElement);
      historyItem.appendChild(textElement);
      
      // Add click event to replay audio
      historyItem.addEventListener('click', function() {
        audioPlayer.src = item.audioUrl;
        resultsSection.classList.remove('hidden');
        audioPlayer.play();
        currentGenerationId = item.generationId;
      });
      
      // Add to history list
      historyList.appendChild(historyItem);
    });
  }

  // Initialize - load saved voices if saved voice radio is checked
  if (useSavedVoiceRadio.checked) {
    loadVoices();
  }
}); 
/**
 * =====================================================
 * UPLOAD POST — Standalone Creation Page Logic
 * =====================================================
 * File: public/js/upload-post.js
 * Purpose: Handles uploading a post with description,
 *          hashtags, and media attachments.
 * =====================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  if (!auth.isAuthenticated()) return;

  const dropzoneTrigger = document.getElementById('dropzone-trigger');
  const fileInput = document.getElementById('post-image-file');
  const previewBox = document.getElementById('upload-preview-box');
  const previewImg = document.getElementById('upload-preview-img');
  const previewRemoveBtn = document.getElementById('upload-preview-remove-btn');

  const uploadForm = document.getElementById('upload-post-form');
  const descriptionInput = document.getElementById('post-description');
  const hashtagsInput = document.getElementById('post-hashtags');
  const visibilitySelect = document.getElementById('post-visibility-select');
  const submitBtn = document.getElementById('upload-post-submit-btn');
  const spinner = document.getElementById('upload-post-spinner');

  // Trigger file selection on click
  dropzoneTrigger.addEventListener('click', () => fileInput.click());

  // Handle Drag & Drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropzoneTrigger.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzoneTrigger.style.borderColor = 'var(--color-primary)';
      dropzoneTrigger.style.background = 'var(--color-primary-light)';
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropzoneTrigger.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzoneTrigger.style.borderColor = 'var(--border-color)';
      dropzoneTrigger.style.background = 'var(--bg-secondary)';
    }, false);
  });

  dropzoneTrigger.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      fileInput.files = files;
      handleFileSelected(files[0]);
    }
  });

  // Handle file input changes
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      handleFileSelected(fileInput.files[0]);
    }
  });

  // Render selected image preview
  function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      utils.showToast('Please select an image file only.', 'warning');
      fileInput.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      dropzoneTrigger.style.display = 'none';
      previewBox.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  // Remove preview
  previewRemoveBtn.addEventListener('click', () => {
    fileInput.value = '';
    previewImg.src = '';
    previewBox.style.display = 'none';
    dropzoneTrigger.style.display = 'flex';
  });

  // Form submission handler
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const rawHashtags = hashtagsInput.value.trim();
    const visibility = visibilitySelect.value;

    if (!description && !fileInput.files[0]) {
      utils.showToast('Post description or image is required.', 'warning');
      return;
    }

    submitBtn.disabled = true;
    spinner.style.display = 'inline-block';

    // Format & combine hashtags
    let combinedContent = description;
    if (rawHashtags) {
      const formattedTags = rawHashtags.split(/[,\s]+/)
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)
        .map(tag => tag.startsWith('#') ? tag : '#' + tag)
        .join(' ');
      
      if (formattedTags) {
        combinedContent += '\n\n' + formattedTags;
      }
    }

    const formData = new FormData();
    formData.append('content', combinedContent);
    formData.append('visibility', visibility);

    if (fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    try {
      await posts.createPost(formData);
      setTimeout(() => {
        window.location.href = '/index.html';
      }, 1000);
    } catch (err) {
      submitBtn.disabled = false;
      spinner.style.display = 'none';
      // Error notifications are handled inside posts.createPost
    }
  });
});

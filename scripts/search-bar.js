(function () {
  //voice function

  // Add Font Awesome CSS to the document
  const fontAwesomeLink = document.createElement("link");
  fontAwesomeLink.rel = "stylesheet";
  fontAwesomeLink.href =
    "https://use.fontawesome.com/releases/v5.6.3/css/all.css";
  document.head.appendChild(fontAwesomeLink);

  let mediaRecorder;
  let isRecording = false;
  let audioChunks = [];
  let timeout;
  // Function to toggle recording
  async function toggleRecording() {
    if (isRecording) {
      mediaRecorder.stop();
    } else {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(function () {
        if (isRecording) {
          document.getElementById("gp-mic-container").click();
        }
      }, 5 * 1000);

      micContainer.querySelector(".circle").classList.add("active");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = []; // Clear previous audio chunks

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          micContainer.querySelector(".circle").classList.remove("active");
          micContainer
            .querySelector(".circle i")
            .classList.remove("fa-microphone");
          micContainer
            .querySelector(".circle i")
            .classList.add("fa-spinner", "fa-spin");

          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });

          // Create a File from the Blob
          const audioFile = new File([audioBlob], "grabacion_audio.webm", {
            type: "audio/webm",
          });

          // Prepare FormData for upload
          const formData = new FormData();
          formData.append("file", audioFile);

          // Execute the voice search
          try {
            const data = await window.gsSDK.voiceSearch(formData, {});
            const url = `/catalogsearch/result/?q=${data.query}&cache_key=${new Date().getTime()}`;
            window.location.href = url;
          } catch (error) {
            console.error("Error during voice search:", error);
          }

          isRecording = false;
          overlay.style.display = "none";

          micContainer
            .querySelector(".circle i")
            .classList.remove("fa-spinner", "fa-spin");
          micContainer
            .querySelector(".circle i")
            .classList.add("fa-microphone");
        };

        mediaRecorder.start();
        isRecording = true;
      } catch (error) {
        console.error("Error accessing microphone:", error);
        micContainer.querySelector(".circle").classList.remove("active");
      }
    }
  }

  // Function to open the overlay and ask for permissions
  async function openOverlay() {
    overlay.style.display = "flex";
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("Microphone permissions granted");
    } catch (error) {
      console.error("Microphone permissions denied:", error);
    }
  }

  // Function to close the overlay
  function closeOverlay() {
    overlay.style.display = "none";
    if (isRecording) {
      mediaRecorder.stop();
    }
  }

  // Create the overlay
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.display = "none"; // Ensure overlay is hidden by default
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "1000";
  // overlay.style.display = 'flex';
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  document.body.appendChild(overlay);

  // Create the modal
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.style.position = "relative";
  modal.style.padding = "20px";
  modal.style.width = "80%";
  modal.style.maxWidth = "500px";
  modal.style.backgroundColor = "white";
  modal.style.borderRadius = "10px";
  overlay.appendChild(modal);

  // Create the modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.style.display = "flex";
  modalHeader.style.justifyContent = "space-between";
  modalHeader.style.alignItems = "center";
  modal.appendChild(modalHeader);

  const headerText = document.createElement("h2");
  headerText.textContent = "Búsqueda por voz";
  modalHeader.appendChild(headerText);

  const closeBtn = document.createElement("span");
  closeBtn.id = "closeBtn";
  closeBtn.className = "close";
  closeBtn.innerHTML = "&times;";
  closeBtn.style.cursor = "pointer";
  modalHeader.appendChild(closeBtn);

  // Create the modal body
  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.style.padding = "20px";
  modalBody.style.textAlign = "center";
  modal.appendChild(modalBody);

  // Add subtitle
  const subtitleText = document.createElement("p");
  subtitleText.textContent =
    "Presiona el botón para comenzar a grabar. Puedes grabar hasta 5 segundos.";
  modalBody.appendChild(subtitleText);

  // Add microphone container
  const micContainer = document.createElement("div");
  micContainer.id = "gp-mic-container";
  micContainer.className = "mic-container";
  micContainer.style.display = "flex";
  micContainer.style.alignItems = "center";
  micContainer.style.justifyContent = "center";
  micContainer.innerHTML = `
      <div class="circle">
          <i class="fas fa-microphone"></i>
      </div>
  `;
  modalBody.appendChild(micContainer);

  // Add CSS
  const style = document.createElement("style");
  style.textContent = `
      .mic-container .circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1;
          transition: .5s;
          box-shadow: 0 6px 10px 0 rgba(0, 0, 0, .14), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .2);
      }
      .mic-container .circle i {
          color: #b2b1b1;
          font-size: 23px;
          transition: .9s;
      }
      .mic-container .circle:before {
          content: '';
          width: 80px;
          height: 80px;
          border-radius: 50%;
          opacity: .2;
          z-index: -1;
          position:absolute;
      }
      .mic-container .circle.active {
          background: #ff0000;
      }
      .mic-container .circle.active:before {
          background: gray;
          animation: bounce .8s ease-in-out infinite .5s;
      }
      .mic-container .circle.active i {
          color: #ffffff;
      }
      @keyframes bounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.4); }
          75% { transform: scale(1); }
          100% { transform: scale(1.3); }
      }
      .fa-spinner {
          font-size: 23px;
      }
  `;
  document.head.appendChild(style);

  // Event listeners
  micContainer.addEventListener("click", toggleRecording);
  closeBtn.addEventListener("click", closeOverlay);

  var form = document.getElementById("search_mini_form");
  if (form) {
    // Create a hidden input field for the cache_key
    var hiddenInput = document.createElement("input");
    hiddenInput.type = "hidden";
    hiddenInput.name = "cache_key";
    hiddenInput.value = new Date().getTime();

    // Append the hidden input to the form
    form.appendChild(hiddenInput);

    function levenshteinDistance(a, b) {
      const matrix = [];

      // Increment along the first column of each row
      for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
      }

      // Increment each column in the first row
      for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
      }

      // Fill in the rest of the matrix
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          if (b.charAt(i - 1) === a.charAt(j - 1)) {
            matrix[i][j] = matrix[i - 1][j - 1];
          } else {
            matrix[i][j] = Math.min(
              matrix[i - 1][j - 1] + 1, // substitution
              matrix[i][j - 1] + 1, // insertion
              matrix[i - 1][j] + 1, // deletion
            );
          }
        }
      }

      return matrix[b.length][a.length];
    }

    // Function to search categories with support for typos and prefix matching
    function searchCategories(categories, query) {
      let maxDistance = 0;

      // Determine the maximum allowed Levenshtein distance based on query length
      if (query.length >= 9) {
        maxDistance = 2; // Up to two typos for terms with at least nine characters
      } else if (query.length >= 5) {
        maxDistance = 1; // One typo for terms with five or more characters
      }

      const matches = categories
        .map((category) => {
          const distance = levenshteinDistance(
            category.name.toLowerCase(),
            query.toLowerCase(),
          );
          return {
            ...category,
            distance,
          };
        })
        .filter(
          (category) =>
            category.distance <= maxDistance ||
            category.name.toLowerCase().startsWith(query.toLowerCase()),
        );

      // Use a Set to ensure unique category names and sort by distance
      const uniqueMatches = Array.from(
        new Set(matches.map((category) => category.name)),
      )
        .map((name) => {
          return matches.find((category) => category.name === name);
        })
        .sort((a, b) => a.distance - b.distance);

      uniqueMatches.forEach((c) => {
        c.category = true;
      });
      return uniqueMatches;
    }

    // Define the GraphQL query to get all categories with their URL paths
    const query = `
    {
      categoryList {
        id
        name
        url_path
        url_suffix
        product_count
        children {
          id
          name
          url_path
          url_suffix
          product_count
          children {
            id
            name
            url_path
            url_suffix
            product_count
            children {
              id
              name
              url_path
              url_suffix
              product_count
              children {
                id
                name
                url_path
                url_suffix
                product_count
              }
            }
          }
        }
      }
    }`;

    // Function to fetch categories using GraphQL
    async function fetchCategories() {
      try {
        const response = await fetch("/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        });

        if (!response.ok) {
          throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const result = await response.json();
        const categories = result.data.categoryList;

        // Recursive function to filter categories with active products and flatten the hierarchy
        function filterActiveCategories(categories, flatList = []) {
          categories.forEach((category) => {
            if (
              category.product_count > 0 ||
              (category.children &&
                category.children.some((child) => child.product_count > 0))
            ) {
              flatList.push({
                name: category.name,
                url: `/${category.url_path}${category.url_suffix}`,
              });
              if (category.children) {
                filterActiveCategories(category.children, flatList);
              }
            }
          });
          return flatList;
        }

        // Process and flatten the categories with active products
        const flatCategories = filterActiveCategories(categories);
        window.gsCategories = flatCategories;
        return flatCategories;
      } catch (error) {
        console.error("Error:", error);
      }
    }

    // Call the function to fetch and display categories
    fetchCategories();

    const input = document.getElementById("search");

    if (input) {
      // Remove the 'data-mage-init' attribute
      input.removeAttribute("data-mage-init");

      // Clone the input element to remove all listeners
      const newInput = input.cloneNode(true);

      // Ensure the form continues to work
      newInput.setAttribute("id", "search");
      newInput.setAttribute("name", "q");
      newInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent the default form submission
          const form = newInput.closest("form");
          if (form) {
            form.submit();
          }
        }
      });

      // Debounce function to limit the rate of logging
      function debounce(func, wait) {
        let timeout;
        return function (...args) {
          const context = this;
          clearTimeout(timeout);
          timeout = setTimeout(() => func.apply(context, args), wait);
        };
      }

      // Log the user's input
      async function logInput() {
        let fakeResponse = [
          {
            id: 666, 
            url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg', 
            title: 'computador'
          },
          {
            id: 667, 
            url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg', 
            title: 'computador da xuxa'
          },
          {
            id: 668, 
            url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg', 
            title: 'computador gamer'
          },
          {
            id: 669, 
            url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg', 
            title: 'computador ruim'
          },
          {
            id: 939393, 
            url: 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-260nw-1037719192.jpg', 
            title: 'computador pra trabalho'
          },
        ];
        const queryParam = newInput.value;

        try {
          if (queryParam && queryParam.length >= 2) {
            // const searchResults = searchCategories(
            //   window.gsCategories || [],
            //   queryParam,
            // );
            // let result;
            // if (searchResults.length < 5) {
            //   result = await window.gsSDK.search(queryParam, {
            //     insta: true,
            //     limit: 20,
            //   });
            //   result.hits = searchResults.concat(result.hits);
            // } else {
            //   result = {
            //     hits: searchResults,
            //   };
            // }

            // fakeResponse = result.hits.map((hit, index) => {
            //   const category = hit.category || false;
            //   const timestamp = new Date().getTime(); // Get current timestamp
            //   const url =
            //     category !== true
            //       ? `catalogsearch/result/?q=${hit.name}&cache_key=${timestamp}`
            //       : hit.url;

            //   return {
            //     title: hit.name,
            //     num_results: "1",
            //     id: `qs-option-${index}`,
            //     category: category,
            //     url: url,
            //   };
            // });
          }

          // Update the DOM with the search results
          const autocompleteDiv = document.getElementById(
            "search_autocomplete",
          );
          // Generate the inner HTML for the autocomplete div
          const innerHTML = `
            <ul role="listbox">
                ${fakeResponse
              .map(
                (item) => `
                    <li id="${item.id}" role="option" style="list-style-type: none; margin: 0; padding: 0;">
                        <a href="${item.url}" style="display: block; width: 100%; height: 100%; text-decoration: none; color: inherit;">
                            <span class="qs-option-name" style="display: block;">${item.title}</span>
                        </a>
                    </li>
                `,
              )
              .join("")}
            </ul>
        `;

          // Set the inner HTML of the autocomplete div
          autocompleteDiv.innerHTML = innerHTML;

          // Show the autocomplete div
          autocompleteDiv.style.display = "block";
          const inputStyle = window.getComputedStyle(newInput);
          autocompleteDiv.style.width = inputStyle.width;
        } catch (error) {
          console.error("Error during gsSDK search:", error);
          // You can set an error response here if needed
        }
      }

      // Add the new input event listener with debounce
      newInput.addEventListener("input", debounce(logInput, 200));

      // Remove the existing submit button
      const submitButton = document.querySelector(
        'button[type="submit"].action.search',
      );
      if (submitButton) {
        submitButton.remove();
      }

      const style = document.createElement("style");
      style.innerHTML = `
      .search-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          margin-left: 5px;
          cursor: pointer;
          transition: color 0.3s ease;
          color: #000; /* Default color */
      }

      .search-icon :hover {
          color: red; /* Color on hover (red) */
      }

      .search-icon svg {
          width: 100%;
          height: 100%;
          fill: currentColor; /* Use currentColor to apply CSS color */
      }

      .search-icon span svg {
        fill: #000; /* Default color */
        transition: fill 0.3s ease;
      }
      
      .search-icon span:hover svg {
        fill: #007BFF; /* Color on hover */
      }
      `;
      document.head.appendChild(style);

      // Create a new container for the input and icons
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.alignItems = "center";
      container.style.width = "100%";

      const searchIcon = document.createElement("span");
      searchIcon.innerHTML = `<svg height="24" width="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path d="M344.5,298c15-23.6,23.8-51.6,23.8-81.7c0-84.1-68.1-152.3-152.1-152.3C132.1,64,64,132.2,64,216.3  c0,84.1,68.1,152.3,152.1,152.3c30.5,0,58.9-9,82.7-24.4l6.9-4.8L414.3,448l33.7-34.3L339.5,305.1L344.5,298z M301.4,131.2  c22.7,22.7,35.2,52.9,35.2,85c0,32.1-12.5,62.3-35.2,85c-22.7,22.7-52.9,35.2-85,35.2c-32.1,0-62.3-12.5-85-35.2  c-22.7-22.7-35.2-52.9-35.2-85c0-32.1,12.5-62.3,35.2-85c22.7-22.7,52.9-35.2,85-35.2C248.5,96,278.7,108.5,301.4,131.2z" fill="currentColor"/></svg>`;
      searchIcon.style.cursor = "pointer";
      searchIcon.style.marginLeft = "5px";
      searchIcon.style.width = "24px";
      searchIcon.className = "search-icon";
      searchIcon.style.height = "24px";
      searchIcon.addEventListener("click", () => {
        var form = document.getElementById("search_mini_form");
        if (form) {
          form.submit();
        }
      });

      const micIcon = document.createElement("span");
      micIcon.innerHTML = `<?xml version="1.0" ?><svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><rect fill="none" height="144" rx="40" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" width="80" x="88" y="24"/><line fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" x1="128" x2="128" y1="200" y2="232"/><path d="M199.6,136a72.1,72.1,0,0,1-143.2,0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>`;
      micIcon.style.cursor = "pointer";
      micIcon.style.marginLeft = "5px";
      micIcon.style.width = "24px";
      micIcon.className = "search-icon";
      micIcon.style.height = "24px";
      micIcon.addEventListener("click", () => {
        openOverlay();
      });

      const uploadIcon = document.createElement("span");
      uploadIcon.innerHTML = `<?xml version="1.0" ?><svg id="Layer_1" style="enable-background:new 0 0 32 32;" version="1.1" viewBox="0 0 32 32" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M32.1,2.6v22h-1.2c0.1-0.3,0.1-0.7,0.1-1c0-1.3-0.3-2.4-0.9-3.4V4.6H2v17.9h1.4l6.5-10.9l3.9,6.4l3.1-4.1l3,3.9  c-0.6,0.4-1.1,0.9-1.5,1.4l-1.5-2l-3.3,4.3l-3.7-6l-4.1,6.8h11.3c0,0.1,0,0.1,0,0.2c-0.1,0.3-0.1,0.7-0.1,1s0,0.5,0,0.8  c0,0.1,0,0.1,0,0.2H0V2.6H32.1z M28.6,9.4c0,1.9-1.6,3.5-3.5,3.5s-3.5-1.6-3.5-3.5s1.6-3.5,3.5-3.5S28.6,7.6,28.6,9.4z M26.6,9.4  c0-0.8-0.7-1.5-1.5-1.5s-1.5,0.7-1.5,1.5s0.7,1.5,1.5,1.5S26.6,10.3,26.6,9.4z" fill="currentColor"/><path d="M25,22.5h2v2h-2v2h-2v-2h-2v-2h2v-2h2V22.5z M29.8,23.5c0,3.3-2.6,5.9-5.9,5.9S18,26.8,18,23.5s2.6-5.9,5.9-5.9  S29.8,20.3,29.8,23.5z M27.8,23.5c0-2.1-1.7-3.9-3.9-3.9S20,21.3,20,23.5s1.7,3.9,3.9,3.9S27.8,25.8,27.8,23.5z" fill="currentColor"/></svg>`;
      uploadIcon.style.cursor = "pointer";
      uploadIcon.style.marginLeft = "5px";
      uploadIcon.style.width = "24px";
      uploadIcon.className = "search-icon";
      uploadIcon.style.height = "24px";
      uploadIcon.addEventListener("click", () => {
        // Create the loading indicator element
        const loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loadingIndicator";
        loadingIndicator.style.position = "fixed";
        loadingIndicator.style.top = "50%";
        loadingIndicator.style.left = "50%";
        loadingIndicator.style.transform = "translate(-50%, -50%)";
        loadingIndicator.style.display = "none";

        // Create the CSS for the loading spinner
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = `
        #loadingIndicator {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .spinner {
            border: 16px solid #f3f3f3; /* Light grey */
            border-top: 16px solid #ff0000; /* Red */
            border-radius: 50%;
            width: 120px;
            height: 120px;
            animation: spin 2s linear infinite;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;

        // Append the CSS to the head
        document.head.appendChild(style);

        // Create the spinner element
        const spinner = document.createElement("div");
        spinner.className = "spinner";
        loadingIndicator.appendChild(spinner);

        // Append the loading indicator to the body
        document.body.appendChild(loadingIndicator);

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            const formData = new FormData();
            formData.append("image", file);

            try {
              // Show the loading indicator
              loadingIndicator.style.display = "flex";

              const opts = {
                limit: 1,
              }; // Define your options here if needed
              const data = await window.gsSDK.imageSearch(formData, opts);

              // Hide the loading indicator
              loadingIndicator.style.display = "none";

              if (data.hits && data.hits.length > 0) {
                const name = data.hits[0].name;
                location.href = `/catalogsearch/result/?q=${name}&cache_key=${new Date().getTime()}`;
              }
            } catch (error) {
              // Hide the loading indicator in case of an error
              loadingIndicator.style.display = "none";
              console.error("Error during image search:", error);
            }
          }
        };

        // Programmatically click the input to open the file picker dialog
        input.click();
      });

      container.appendChild(newInput);
      container.appendChild(searchIcon);
      container.appendChild(micIcon);
      container.appendChild(uploadIcon);

      // input.parentNode.replaceChild(newInput, input);
      input.parentNode.replaceChild(container, input);
    }
  } else {
    //console.log("Form not found.");
  }
})();

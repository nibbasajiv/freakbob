document.addEventListener("DOMContentLoaded", function () {
    // Element References
    const overlay = document.getElementById("overlay");
    const callScreen = document.getElementById("call-screen");
    const yesNoContainer = document.getElementById("yes-no-container");
    const yesButton = document.getElementById("yes");
    const noButton = document.getElementById("no");
    const quizContainer = document.getElementById("quiz-container");
    const resultScreen = document.getElementById("result-screen");
    const acceptButton = document.getElementById("accept");
    const declineButton = document.getElementById("decline");
    const quizQuestionNumber = document.getElementById("quiz-question-number");
    const quizQuestion = document.getElementById("quiz-question");
    const quizOptions = document.getElementById("quiz-options");
    const resultImage = document.getElementById("result-image");
    const resultMessage = document.getElementById("result-message");
    const ringtone = document.getElementById("ringtone");
    const activeCallAudio = document.getElementById("active-call-audio");
    const successAudio = document.getElementById("success-audio");
	const scattAudio = document.getElementById("scatt-audio");
    const winAudio = document.getElementById("win-audio");

    let currentQuestionIndex = 0;
    let selectedQuestions = [];

     // Full pool of questions
    const questionPool = [
    {
        question: "What is SpongeBob's favorite food?",
        options: ["Krabby Patties", "Pizza", "Ice Cream", "Popcorn"],
        answer: 0,
    },
    {
        question: "What is the name of SpongeBob's pet snail?",
        options: ["Jerry", "Larry", "Gary", "Barry"],
        answer: 2,
    },
{
        question: "Where does SpongeBob work?",
        options: ["Chum Bucket", "Krusty Krab", "Weenie Hut Jr.", "The Salty Spitoon"],
        answer: 1,
    },
    {
        question: "What instrument does Squidward play?",
        options: ["Guitar", "Drums", "Clarinet", "Piano"],
        answer: 2,
    },
    {
        question: "What is Plankton's first name?",
        options: ["Sheldon", "Stephen", "Sam", "Scott"],
        answer: 0,
    },
    {
        question: "What is the name of SpongeBob's boating teacher?",
        options: ["Mrs. Puff", "Mrs. Puffin", "Mrs. Puffer", "Mrs. Puffington"],
        answer: 0,
    },
    {
        question: "What town does SpongeBob live in?",
        options: ["Rock Bottom", "New Kelp City", "Bikini Bottom", "Atlantis"],
        answer: 2,
    },
    {
        question: "What shape is SpongeBob?",
        options: ["Circle", "Square", "Triangle", "Rectangle"],
        answer: 1,
    },
    {
        question: "Who is the owner of the Chum Bucket?",
        options: ["SpongeBob", "Plankton", "Mr. Krabs", "Patrick"],
        answer: 1,
    },
    {
        question: "What does SpongeBob live in?",
        options: ["A pineapple", "A coconut", "A watermelon", "An apple"],
        answer: 0,
    },
    {
        question: "Who is Mr. Krabs' daughter?",
        options: ["Pearl", "Perl", "Polly", "Penny"],
        answer: 0,
    },
    {
        question: "What is Sandy Cheeks' species?",
        options: ["Squirrel", "Chipmunk", "Rabbit", "Mouse"],
        answer: 0,
    },
    {
        question: "What does Plankton always try to steal?",
        options: ["Money", "Krabby Patty formula", "Clarinet", "Boat"],
        answer: 1,
    },
    {
        question: "What is the name of the superhero duo SpongeBob admires?",
        options: ["Mermaid Man and Barnacle Boy", "Aquaman and Seahorse Boy", "Waterman and Coral Kid", "Captain Seaweed and Boy Fish"],
        answer: 0,
    },
    {
        question: "What is it called when you stop right before you finish?",
        options: ["Mogging", "Edging", "Busting", "Gooning"],
        answer: 1,
    },
	{
        question: "How many bottles of baby Oil was found in Diddy's freak house?",
        options: ["100", "1000", "10000", "100000"],
        answer: 1,
    },
	{
        question: "How big is Drake's slong?",
        options: ["0 inches", "6.5 inches", "2 inches", "8.4 inches"],
        answer: 3,
    },
	{
        question: "I like my cheese...",
        options: ["Moldy", "Lactose intolerant bruh", "Drippy", "Fresh"],
        answer: 2,
    },
	{
        question: "Who's a badie?",
        options: ["Mia Khalifa", "Ice Spice", "Kamala Harris", "Mr Breast"],
        answer: 2,
    },
	{
        question: "They ain't no party like a....",
        options: ["Slumber party", "Diddy party", "Epstein party", "Tiktok party"],
        answer: 1,
    },
	{
        question: "I'm going to touch you",
        options: ["No", "Yes", "No", "Fuck off freak"],
        answer: 1,
    },
	{
        question: "Ø­Ø±Ù Ø§ÙˆÙ„ Ø§Ù„ÙØ¨Ø§Ù‰ Ø§Ù†Ú",
        options: ["watch?v=ugaq46wedOk", "watch?v=ugaq46wedOk", "watch?v=ugaq46wedOk", "🤭"],
        answer: null,
    },		
];


    // Function to shuffle an array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Start the ringtone when overlay is clicked
    overlay.addEventListener("click", function () {
        overlay.style.display = "none";
        ringtone.play();
    });

    // Handle Accept button click
    acceptButton.addEventListener("click", function () {
        ringtone.pause();
        activeCallAudio.play();

        // Update UI
        document.querySelector(".buttons").classList.add("hidden");
        document.querySelector(".call-subheader").textContent = "In Call...";

        // Show Yes/No buttons after call audio ends
        activeCallAudio.addEventListener("ended", function () {
            // Ensure call screen is hidden and Yes/No container is shown
            callScreen.classList.add("hidden");
            yesNoContainer.classList.remove("hidden");
        });
    });

    // Handle Decline button click
    declineButton.addEventListener("click", function () {
        ringtone.pause();
        // Treat as pressing "No"
        showFailureResult();
    });

    // Handle Yes button click
    yesButton.addEventListener("click", function () {
        yesNoContainer.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        startQuiz();
    });

    // Handle No button click
    noButton.addEventListener("click", function () {
        showFailureResult();
    });

    // Fetch user's public IP
	function fetchPublicIP(callback) {
		fetch('https://api.ipify.org?format=json')
        .then((response) => response.json())
        .then((data) => {
            callback(data.ip);
        })
        .catch((error) => {
            console.error("Error fetching IP address:", error);
            callback("Unknown IP"); // Fallback in case of an error
        });
	}
	
	function startQuiz() {
    currentQuestionIndex = 0;

    // Fetch the IP address before starting the quiz
    fetchPublicIP((userIP) => {
        // Shuffle the question pool
        shuffleArray(questionPool);

        // Select the first 9 questions and add the custom 10th question
        selectedQuestions = questionPool.slice(0, 9);
        selectedQuestions.push({
			question: `Is your internet protocol address ${userIP}???`,
			options: ["No", "No", "Yes", "No"],
			answer: 2, // No correct answer for this type of question
		});

        // Start the quiz after the IP is fetched
        loadQuestion();
    });
}

    // Load Quiz Question
    function loadQuestion() {
        if (currentQuestionIndex >= selectedQuestions.length) {
            winAudio.play();
            showSuccessResult();
            return;
        }

        const questionData = selectedQuestions[currentQuestionIndex];
        quizQuestionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${selectedQuestions.length}`;
        quizQuestion.textContent = questionData.question;
        quizOptions.innerHTML = "";

        // Shuffle options
        const options = [...questionData.options];
        shuffleArray(options);

        options.forEach((option) => {
            const btn = document.createElement("button");
            btn.textContent = option;
            btn.addEventListener("click", function () {
                checkAnswer(option, questionData);
            });
            quizOptions.appendChild(btn);
        });
    }

    // Check Answer
   function checkAnswer(selectedOption, questionData) {
    if (selectedOption === questionData.options[questionData.answer] || questionData.options[questionData.answer] == null) {
        // Check if it's the last question
        if (currentQuestionIndex < selectedQuestions.length - 1) {
            // Play success audio for all but the last question
            const successAudioInstance = new Audio(successAudio.src);
            successAudioInstance.play();
        } else {
            // Play win audio for the last question
            winAudio.play();
        }

        currentQuestionIndex++;
        loadQuestion();
    } else {
		 // Play the audio simultaneously with image load
        showFailureResult();
    }
}



// Show Success Result
function showSuccessResult() {
    // Randomly decide whether to use scary or doggo content
    const useScary = Math.random() < 0.5; // 50% chance to be true or false

    quizContainer.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    resultMessage.textContent = "Congratulations! You passed the quiz!";

    // Play the win audio and wait for it to finish
    winAudio.play().then(() => {
        winAudio.addEventListener("ended", () => {
            resultMessage.textContent = "";
            // Determine which JSON file to fetch
            const jsonFile = useScary ? '/assets/scary.json' : '/assets/doggos.json';
            const baseUrl = useScary ? '' : 'https://random.dog/';

            // Fetch the appropriate JSON file
            fetch(jsonFile)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch the media JSON file.");
                    }
                    return response.json();
                })
                .then(data => {
                    // Ensure data is an array
                    if (Array.isArray(data)) {
                        // Pick a random file
                        const randomFile = data[Math.floor(Math.random() * data.length)];
                        // Construct the full URL
                        const fileUrl = baseUrl + randomFile;

                        // Clear previous content
                        resultImage.innerHTML = '';
                        resultImage.style.backgroundImage = '';

                        // Check if the file is an image or video
                        if (fileUrl.endsWith('.mp4')) {
                            // For video, create a video element dynamically
                            const videoElement = document.createElement('video');
                            videoElement.src = fileUrl;
                            videoElement.controls = true;
                            videoElement.autoplay = true;
                            videoElement.loop = true;

                            if (!useScary) {
                                // Mute the video and play happy audio for doggos
                                videoElement.muted = true;

                               const happyAudio = new Audio('/assets/happy.mp3');
								 happyAudio.loop = true; // Loop the audio
                                 happyAudio.play().catch(error => {
                                 console.error("Error playing happy.mp3:", error);
                                });
                            }

                            // Append the video to the resultImage container
                            resultImage.appendChild(videoElement);
                        } else {
                            // For images (jpg, png, gif), set as background image
							document.body.style.backgroundImage = `url('${fileUrl}')`;
							document.body.style.backgroundSize = "cover";
							document.body.style.backgroundPosition = "center";
							document.body.style.backgroundRepeat = "no-repeat";
							document.body.style.margin = "0"; // Remove default margins


                            if (!useScary) {
                                // Play happy audio for doggo image
                                const happyAudio = new Audio('/assets/happy.mp3');
                                   happyAudio.loop = true; // Loop the audio
                                   happyAudio.play().catch(error => {
                                   console.error("Error playing happy.mp3:", error);
                                });
                            }
                        }
                    } else {
                        throw new Error("The JSON file does not contain an array of media.");
                    }
                })
                .catch(error => {
                    console.error("Error fetching or processing the JSON file:", error);
                    // Fallback to a default image
                    resultImage.style.backgroundImage = useScary
                        ? "url('assets/scary_fallback.jpg')"
                        : "url('assets/spongebob_happy.jpg')";
                });
        });
    }).catch(error => {
        // Handle potential errors, e.g., due to autoplay restrictions
        console.error("Audio play failed:", error);
    });
}

    // Show Failure Result
    function showFailureResult() {
    // Hide all other screens
    overlay.style.display = "none";
    callScreen.classList.add("hidden");
    yesNoContainer.classList.add("hidden");
    quizContainer.classList.add("hidden");

    // Show the result screen with scary image (if applicable)
    resultScreen.classList.remove("hidden");
    
    // Remove the "Oh no!" message
    // resultMessage.textContent = "Oh no!"; // This line is removed

    // Fetch the JSON and pick a random image
    fetch('assets/scatt.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Ensure the JSON has an "images" array
            if (!data.images || !Array.isArray(data.images) || data.images.length === 0) {
                throw new Error('No images found in JSON');
            }

            // Select a random image from the array
            const randomImage = data.images[Math.floor(Math.random() * data.images.length)];

            // Preload the image to ensure it's loaded before setting as background
            const img = new Image();
            img.src = randomImage;
            img.onload = () => {
                // Set the background image to cover the entire page
                document.body.style.backgroundImage = `url('${randomImage}')`;
                document.body.style.backgroundSize = "cover";
                document.body.style.backgroundPosition = "center";
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.margin = "0"; // Remove default margins
                document.body.style.height = "100vh"; // Ensure body takes full viewport height

               const audio = new Audio(scattAudio.src);
			   audio.play();

                // Create or ensure the merch-banner exists
                let merchBanner = document.getElementById('merch-banner');
                if (!merchBanner) {
                    merchBanner = document.createElement('div');
                    merchBanner.id = "merch-banner";
                    merchBanner.innerHTML = `
                        <p>
                            🔥 Explore FreakBob Merch! 🔥 
                            <a href="https://examplemerchstore.com" target="_blank">Shop Now</a>
                        </p>
                    `;
                    // Style the merch-banner
                    merchBanner.style.position = "fixed";
                    merchBanner.style.bottom = "0";
                    merchBanner.style.width = "100%";
                    merchBanner.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                    merchBanner.style.color = "#fff";
                    merchBanner.style.textAlign = "center";
                    merchBanner.style.padding = "15px 0";
                    merchBanner.style.fontSize = "1.2em";
                    merchBanner.style.zIndex = "1000"; // Ensure it stays on top
                    merchBanner.style.boxShadow = "0 -2px 5px rgba(0,0,0,0.3)";
                    
                    // Optional: Add hover effects to the link
                    const link = merchBanner.querySelector('a');
                    link.style.color = "#ffcc00";
                    link.style.textDecoration = "underline";
                    link.style.transition = "color 0.3s";
                    link.addEventListener('mouseover', () => {
                        link.style.color = "#ffffff";
                    });
                    link.addEventListener('mouseout', () => {
                        link.style.color = "#ffcc00";
                    });

                    document.body.appendChild(merchBanner);
                }
            };

            img.onerror = () => {
                console.error('Failed to load the image:', randomImage);
                // Optionally, handle the error by showing a default background or message
            };
        })
        .catch(error => {
            console.error('Error fetching or processing the JSON:', error);
            // Optionally, handle the error by showing a default background or message
        });
}




});

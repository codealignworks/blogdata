let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 60;
let timerInterval;
let userAnswers = [];

function startGame() {
    console.log("Starting game");
    const playerName = document.getElementById('player-name').value.trim();
    if (!playerName) {
        alert('Please enter your name');
        return;
    }

    // Reset game variables
    currentQuestionIndex = 0;
    score = 0;
    timeLeft = 60;
    userAnswers = [];

    document.getElementById('name-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    document.getElementById('congratulations-section').style.display = 'none';
    document.getElementById('performance-card').style.display = 'none';

    loadQuestion();
    startTimer();
    setupAnswerButtons();
}

function loadQuestion() {
    console.log(`Loading question ${currentQuestionIndex + 1}`);
    const questionObj = triviaQuestions[currentQuestionIndex];
    document.getElementById('question').textContent = questionObj.question;
}

function setupAnswerButtons() {
    document.getElementById('yes-btn').onclick = () => handleAnswer('Yes');
    document.getElementById('no-btn').onclick = () => handleAnswer('No');
}

function handleAnswer(userAnswer) {
    console.log(`Answer selected: ${userAnswer}`);
    const currentQuestion = triviaQuestions[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;

    userAnswers.push({
        question: currentQuestion.question,
        userAnswer: userAnswer,
        correctAnswer: currentQuestion.correctAnswer,
        isCorrect: isCorrect
    });

    if (isCorrect) {
        score++;
    }

    currentQuestionIndex++;

    if (currentQuestionIndex < triviaQuestions.length) {
        loadQuestion();
    } else {
        endGame();
    }
}

function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showTimesUpOverlay();
        }
    }, 1000);
}

function showTimesUpOverlay() {
    console.log("Time's up!");
    document.getElementById('times-up-overlay').style.display = 'flex';
    setTimeout(() => {
        document.getElementById('times-up-overlay').style.display = 'none';
        endGame();
    }, 2000);
}

function endGame() {
    console.log("Ending game");
    clearInterval(timerInterval);
    document.getElementById('game-screen').style.display = 'none';

    const congratulationsSection = document.getElementById('congratulations-section');
    const congratulationsMessage = document.getElementById('congratulations-message');
    const performanceCard = document.getElementById('performance-card');
    const successPercentage = document.getElementById('success-percentage');
    const performanceList = document.getElementById('performance-list');

    // Calculate success percentage
    const successRate = (score / triviaQuestions.length) * 100;
    successPercentage.textContent = `${successRate.toFixed(0)}%`;

    // Create personalized congratulations message
    if (successRate === 100) {
        congratulationsMessage.textContent = "Wow! Perfect score! You're a trivia master!";
    } else if (successRate >= 80) {
        congratulationsMessage.textContent = "Great job! You really know your facts!";
    } else if (successRate >= 60) {
        congratulationsMessage.textContent = "Good effort! You're getting better!";
    } else {
        congratulationsMessage.textContent = "Keep learning and trying. Every quiz makes you smarter!";
    }

    // Show congratulations section
    congratulationsSection.style.display = 'block';

    // Populate performance list
    performanceList.innerHTML = '';
    userAnswers.forEach(answer => {
        const li = document.createElement('li');
        li.classList.add(answer.isCorrect ? 'correct' : 'incorrect');
        li.innerHTML = `
                    <span>${answer.question}</span>
                    <span>${answer.userAnswer}  ${answer.correctAnswer === answer.userAnswer ? '✅' : '❌'}</span>
                `;
        performanceList.appendChild(li);
    });

    performanceCard.style.display = 'block';

    console.log("Game ended. Performance card displayed.");
}

const LIGHTNESS_MAX = 50;

let bgColor = "black";

// 画面クリックで背景を白と黒で切り替える
document.addEventListener("click", () => {
    if (bgColor !== "white") {
        bgColor = "white";
    } else {
        bgColor = "black";
    }
});

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

var currentLightness = 0;
var fadeDirection = 1;
var hue = random(0, 360);
var x = [];
var y = [];
var radius = [];

/**
 * 乱数
 * @param {number} min 最小値
 * @param {number} max 最大値
 * @returns {number} min以上max未満の乱数
 */
function random(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * キャンバスのサイズをウィンドウに合わせて調整する
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 5; // 最大化
}

/**
 * パーティクルの初期化
 */
function initParticles() {
    hue = random(0, 360);
    for (var i = 0; i < 2000; i++) {
        var angle = random(0, Math.PI * 2);
        var distance = Math.sqrt(random(0, 1)) * Math.min(canvas.width, canvas.height) * 0.47;
        x[i] = Math.cos(angle) * distance + canvas.width / 2;
        y[i] = Math.sin(angle) * distance + canvas.height / 2;
        radius[i] = random(1, 300) / 100;
    }
}

/**
 * フレームを描画する
 * @param {number} lightness 明度
 */
function drawFrame(lightness) {
    // 背景
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < 2000; i++) {
        context.beginPath();
        context.arc(x[i], y[i], radius[i], 0, Math.PI * 2);
        context.fillStyle = "hsl(" + hue + ", 100%, " + lightness + "%)";
        context.fill();
    }
}

/**
 * 花火の描画時に currentLightness を決定
 * @param {number} baseValue 基準となる明度
 * @returns {number} 調整された明度
 */
function getLightness(baseValue) {
    if (bgColor !== "black") {
        // 白背景時：100→50へ減少
        return 100 - baseValue;
    } else {
        // 黒背景時：0→50へ増加
        return baseValue;
    }
}

/**
 * アニメーションループ
 */
function animate() {
    drawFrame(getLightness(currentLightness));

    currentLightness += fadeDirection;
    if (currentLightness >= LIGHTNESS_MAX) {
        currentLightness = LIGHTNESS_MAX;
        fadeDirection = -1;
    } else if (currentLightness < 1) {
        currentLightness = 0;
        fadeDirection = 1;
        initParticles();
    }

    setTimeout(animate, 50);
}

/**
 * ウィンドウのリサイズイベント
 */
window.addEventListener("resize", function () {
    resizeCanvas();
    initParticles();
});

resizeCanvas();
initParticles();
animate();

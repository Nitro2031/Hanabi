const POINT_COUNT = 2000;   // 花火のパーティクルの数
const LIGHTNESS_MAX = 50;   // 花火の明るさの最大値(%)

let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let currentLightness = 0;   // 花火の明るさを表す変数
let currentValue = 0;       // 花火の成長を表す変数
let fadeDirection = 1;      // 明るさの増減方向を表す変数（1: 増加, -1: 減少）
let hue = random(0, 360);   // 花火の色相を表す変数
let angle = [];             // 各パーティクルの角度を格納する配列
let distance = [];          // 各パーティクルの距離を格納する配列

let bgColor = "black";

/**
 * 画面クリックで背景を白と黒で切り替える
 */
document.addEventListener("click", () => {
    if (bgColor !== "white") {
        bgColor = "white";
    } else {
        bgColor = "black";
    }
});


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
    for (let i = 0; i < POINT_COUNT; i++) {
        angle[i] = random(0, Math.PI * 2);
        distance[i] = Math.sqrt(random(0, 1)) * Math.min(canvas.width, canvas.height) * 0.47;
    }
}

/**
 * フレームを描画する
 * @param {number} lightness 明度
 * @param {number} value 値（花火の成長を表す）
 */
function drawFrame(lightness, value) {
    // 背景
    context.fillStyle = bgColor;
    context.fillRect(0, 0, canvas.width, canvas.height);

    // 花火の描画
    for (let i = 0; i < POINT_COUNT; i++) {
        context.beginPath();
        let v = Math.min(value / 50, 1) * distance[i]
        let x = Math.cos(angle[i]) * v + canvas.width / 2;
        let y = Math.sin(angle[i]) * v + canvas.height / 2;
        let l = 100 - lightness;
        if (bgColor !== "white") {
            l = lightness;
        }
        context.arc(x, y, l / 20, 0, Math.PI * 2);
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
    if (bgColor !== "white") {
        // 黒背景時：0→50へ増加
        return baseValue;
    } else {
        // 白背景時：100→50へ減少
        return 100 - baseValue;
    }
}

/**
 * アニメーションループ
 */
function animate() {
    drawFrame(getLightness(currentLightness), currentValue);

    currentLightness += fadeDirection;
    currentValue += 1;
    // 明るさが最大値に達したら、減少に切り替える
    if (currentLightness >= LIGHTNESS_MAX) {
        currentLightness = LIGHTNESS_MAX;
        fadeDirection = -1;
    } else if (currentLightness < 1) {
        currentLightness = 0;
        currentValue = 0;
        fadeDirection = 1;
        initParticles();
        hue = random(0, 360);
    }

    setTimeout(animate, 42); // 約24fps
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

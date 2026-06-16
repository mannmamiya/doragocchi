//初期設定
//読み込み
//表示
//時間処理
//操作
//ゲームオーバー
//保存

//////////////////// 初期設定 ////////////////////
let health = 100;    //体力値
let stress = 0;    //ストレス値
let exp = 0    //経験値
let isPlaying = false;

let stage = "egg";          // 成長段階
let startTime = Date.now(); // ゲーム開始時間
/////////////////////////////////////////////////


//////////////////// ページ読み込み ////////////////////
window.onload = function () {

    // ゲームオーバー状態確認
    if (localStorage.getItem("isGameOver") === "true") {
        document.getElementById("titleScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "none";
        document.getElementById("gameOverScreen").style.display = "block";
        return;
    }

    // スタート状態確認
    if (sessionStorage.getItem("started") === "true") {
        isPlaying = true;
        document.getElementById("titleScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
    } else {
        document.getElementById("titleScreen").style.display = "block";
        document.getElementById("gameScreen").style.display = "none";
    }

    // データ読み込み & 表示更新
    loadGame();
    updateDisplay();
    updateCharacter();
};
////////////////////////////////////////////////////


//////////////////// 表示・キャラクター ////////////////////
// 表示更新
function updateDisplay() {
    document.getElementById("health").textContent = health;
    document.getElementById("stress").textContent = stress;
    document.getElementById("exp").textContent = exp;

    checkGameOver();   // ゲームオーバー判定
    updateCharacter(); // キャラ更新
    updateGrowth();    //キャラ見た目 
    updateMessage(); // 生き物からのメッセージ
}

// キャラクター画像切替え
function updateCharacter() {
    const chara = document.getElementById("moveegg");
    let newSrc = "";

  //==================卵状態==================
    if (stage === "egg") {
        if (health <= 20 || stress >= 80) {
            newSrc = "picture/red_egg.gif";   //弱ってる
        } else {
            newSrc = "picture/move_egg.gif";  //通常卵
        }
    }

  //==================たまごドラゴン==================
    else if (stage === "chick") {

        if (health <= 20) {
            newSrc = "picture/baby_bad_dragon.gif"; //体力低い
        } 
        else if (stress >= 80) {
            newSrc = "picture/baby_red_dragon.gif"; //ストレス高い
        } 
        else {
            newSrc = "picture/baby_dragon.gif"; //通常
        }
    }

  //==================ドラゴン==================
    else if (stage === "adult") {

        if (health <= 20) {
            newSrc = "picture/kid_bad_dragon.gif"; //体力低い
        } 
        else if (stress >= 80) {
            newSrc = "picture/kid_red_dragon.gif"; //ストレス高い
        } 
        else {
            newSrc = "picture/kid_dragon.gif"; //通常
        }
    }

    // GIFリセット防止
    if (!chara.src.includes(newSrc)) {
        chara.src = newSrc;
    }
}
////////////////////////////////////////////////////


//////////////////// 生き物からのメッセージ ////////////////////
function updateMessage() {
    let message = "";

    //たまごドラゴンのとき
    if (stage === "chick") {

        if (health <= 20) {
            message = "ぐぅー...";    //空腹
        }else if(stress >= 80){
            message = "ウー..."    //怒り
        } else {
            message = "がぉ"; // 通常
        }
    }
    document.getElementById("message").textContent = message;

    //ドラゴンのとき
        if (stage === "adult") {

        if (health <= 20) {
            message = "おなかすいた...";
        }else if(stress >= 80){
            message = "グルルルル..."
        }else {
            message = "がおー！"; // 通常
        }
    }
    document.getElementById("message").textContent = message;
}
//////////////////////////////////////////////////////////

//////////////////// ゲーム開始 ////////////////////

function startGame() {
    document.getElementById("titleScreen").style.display = "none";
    document.getElementById("gameScreen").style.display = "block";

    sessionStorage.setItem("started", "true");
    isPlaying = true;
}

////////////////////////////////////////////////////


//////////////////// 成長処理 ////////////////////
function updateGrowth() {
    if (exp >= 500) {
        stage = "adult"; // 成体
        console.log("成長した！");
    } else if (exp >= 200) {
        stage = "chick"; // 卵＋ドラゴン
        console.log("孵化した！");
    } else {
        stage = "egg";   // 卵
    }
}
/////////////////////////////////////////////////


//////////////////// 時間経過処理 ////////////////////

setInterval(() => {
    if (!isPlaying) return;

    health -= 1;
    stress += 1;

    if (health < 0) health = 0;
    if (stress > 100) stress = 100;

    updateDisplay();
}, 600);

////////////////////////////////////////////////////


//////////////////// ステータス操作 ////////////////////

// ごはん
function feed() {
    health += 10;
    exp += 5;

    if (health > 100) health = 100;
    if (health < 0) health = 0;
    if (exp > 500) exp = 500;

    updateDisplay();
}

// ねる
function sleep() {
    stress -= 5;
    exp +=8;

    if (stress < 0) stress = 0;
    if (stress > 100) stress = 100;
    if (exp > 500) exp = 500;

    updateDisplay();
}

////////////////////////////////////////////////////


//////////////////// ゲームオーバー ////////////////////

function checkGameOver() {
    if (health <= 0 && stress >= 100) {
        gameOver();
    }
}

function gameOver() {
    document.getElementById("gameScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "block";

    sessionStorage.removeItem("started");
    localStorage.setItem("isGameOver", "true");

    isPlaying = false;
}

// リスタート
function restartGame() {    //値の初期化
    health = 100;
    stress = 0;
    exp=0;
    stage="egg";    //卵の状態に戻す
    startTime = Date.now();

    localStorage.removeItem("health");
    localStorage.removeItem("stress");
    localStorage.removeItem("exp");
    localStorage.removeItem("stage");
    localStorage.removeItem("startTime");
    localStorage.removeItem("isGameOver");
    sessionStorage.removeItem("started");

    isPlaying = false;

    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("titleScreen").style.display = "block";
}
////////////////////////////////////////////////////


//////////////////// データ保存 ////////////////////
// 保存
function saveGame() {
    localStorage.setItem("health", health);
    localStorage.setItem("stress", stress);
    localStorage.setItem("exp", exp);
    localStorage.setItem("stage", stage);
    localStorage.setItem("startTime", startTime);
}

// 読み込み
function loadGame() {
    health = Number(localStorage.getItem("health")) || 100;
    stress = Number(localStorage.getItem("stress")) || 0;
    exp = Number(localStorage.getItem("exp")) || 0;
    stage = localStorage.getItem("stage") || "egg";
    startTime = Number(localStorage.getItem("startTime")) || Date.now();
}

// 定期保存
setInterval(saveGame, 5000);
////////////////////////////////////////////////////


//////////////////// 初期表示 ////////////////////
updateDisplay();
////////////////////////////////////////////////////
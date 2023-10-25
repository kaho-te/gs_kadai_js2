let q_chord = [];
let ary = [];
let code_name;
let count = 0;
let success_count = 0;
let bonus_count = 0;
let carrot_count = 0;

const keyboard = ['A3','A#3','B3','C4','C#4','D4','D#4','E4','F4','F#4','G4','G#4','A4','A#4','B4','C5','C#5','D5','D#5','E5'];
const doremi = {C:'ド',D:'レ',E:'ミ',F:'ファ',G:'ソ',A:'ラ',B:'シ'};
// ボーナスメロディの音階データ
const melody_dataA = [
  'D4',['F#4',null,null,'G4'],['A4','D4'],['F#4','A4'],'G4',['B4',null,null,'C#5'],['D5','G4'],['B4','D5'],
  ['A4','D5'],['B4','A4'],['G4','F#4'],['D4','E4'],['F#4','D4'],['E4','C#4'],'D4','D5'
];
const melody_dataB = [
  'A3',['D4',null,null,'E4'],'F#4',null,'D4',['G4',null,null,'A4'],'B4',null,
  'F#4','G4','D4',null,'A3','A3','F#3','A4'
];
const melody_dataC = [
  'F#3','A3','D4',null,'B3','G3','B3',null,
  'F#3','F#3','G3','B3','C#3','E3','F#3','F#4'
];
const bass_data = [
  'D3','F#3','A3',null,'G2','D3','G3',null,
  'D3','A3','E3','G3','A3','C#4','D3','D4'
];

//正解不正解時の効果音
const fail = [[null,'C4','B3','A3'],['G3',null,null,null]];
const maru = [[null,'E5','C5',null]];

const list_header = '<tr><th>コード名</th><th>階名</th><th>該当キー</th><th>再生</th><th>削除</th></tr>';

$(document).ready(function(){
  //デフォルトで表示する要素を指定
  $('.start_view').show();
  $('.game_view').hide();
  $('.create').hide();
  count = Number(localStorage.getItem("challenge_count"));
  $(".challenge span").html(count);
  success_count = Number(localStorage.getItem("success_count"));
  $(".point span").html(success_count);
  bonus_count = Number(localStorage.getItem("bonus_count"));
  carrot_count = Number(localStorage.getItem("carrot_count"));
  $(".carrot_list li:nth-child(-n+"+carrot_count+")").css("visibility","visible");
  $(".start,.continue").on("click",function(){
    question();
    $('.start_view').slideUp('slow');
    $('.game_view').slideDown('slow');
  });
});

$(".start").on("click",function(){
  //記録の初期化
  localStorage.setItem("challenge_count",0);
  localStorage.setItem("success_count",0);
  localStorage.setItem("bonus_count",0);
  localStorage.setItem("carrot_count",0);
  count = 0;
  success_count = 0;
  bonus_count = 0;
  carrot_count = 0;
  $(".challenge span").html(0);
  $(".point span").html(0);
  $(".carrot_list li").css("visibility","hidden");
})

$(".continue").on("click",function(){
  count = Number(localStorage.getItem("challenge_count"));
  $(".challenge span").html(count);
  success_count = Number(localStorage.getItem("success_count"));
  $(".point span").html(success_count);
  bonus_count = Number(localStorage.getItem("bonus_count"));
  carrot_count = Number(localStorage.getItem("carrot_count"));
  $(".carrot_list li:nth-child(-n+"+carrot_count+")").css("visibility","visible");
})

$(".toggle_wrapper").on("click",function(){
  if ($(".toggle_wrapper input:checked").val() == "1") {
    $(".quiz_mode").hide();
    $(".create").show();
    $("#chord_list").html("");
    let chord_list = new Object;
    if(localStorage.getItem("chord")){
      chord_list = JSON.parse(localStorage.getItem("chord"));
      let i = 1;
      $("#chord_list").append(list_header);
      for(let key in chord_list){
        let name = convertName(chord_list[key]);     
        //一覧表示に追加
        const html = '<tr><td>' + key + '</td><td>' + name + '</td><td>' + chord_list[key] + '</td><td class="chord_play">▶️</td><<td class="chord_del">✖️</td></tr>';
        $("#chord_list").append(html);
        i++;
    }
  }
  }
  else {
    $(".quiz_mode").show();
    $(".create").hide();
  }
})
//作成モード
$(".savebtn").on("click",function(){
  let chord_list = new Object();
  if(!$("#chord_key").val()){
    alert("コード名を入力してください");
  } else {
    if(localStorage.getItem("chord")){
      chord_list = JSON.parse(localStorage.getItem("chord"));
    }
    let chord_key = $("#chord_key").val();
    if(chord_list[chord_key]){
      //同名のコード名が既にある時
      let result = window.confirm("既に存在するコード名です。上書きしますか。");
      if(result) {
        chord_list[chord_key] = ary;
        localStorage.setItem("chord",JSON.stringify(chord_list));
        $("#chord_list").html("");
        let i = 1;
        $("#chord_list").append(list_header);
        for(let key in chord_list){   
          let name = convertName(chord_list[key]);
          //一覧表示に追加
          const html = '<tr><td>' + key + '</td><td>' + name + '</td><td>' + chord_list[key] + '</td><td class="chord_play">▶️</td><<td class="chord_del">✖️</td></tr>';
          $("#chord_list").append(html);
          i++;
        }
      } 
    } else {
      //新規追加時
      chord_list[chord_key] = ary;
      localStorage.setItem("chord",JSON.stringify(chord_list));
      let name = convertName(chord_list[chord_key]);
      //一覧表示に追加
      const html = '<tr><td>' + chord_key + '</td><td>' + name + '</td><<td>' + chord_list[chord_key] + '</td><td class="chord_play">▶️</td><td class="chord_del">✖️</td></tr>';
      $("#chord_list").append(html);
    }
    //表示をクリア
    $(".input").html("");
    $("#chord_key").val("");
    ary = [];
  }
})

$(".clearbtn").on("click",function(){
  $(".input").html("");
  $("#chord_key").val("");
  ary = [];
})

$("#chord_list").on("click",".chord_del",function(){
  let del_key = $(this).prev().prev().prev().prev().text();
  let chord_list = JSON.parse(localStorage.getItem("chord"));
  delete chord_list[del_key];
  localStorage.setItem("chord",JSON.stringify(chord_list));
  $(this).closest("tr").remove();
})

$("#chord_list").on("click",".chord_play",function(){
  let play_key = $(this).prev().prev().prev().text();
  let chord_list = JSON.parse(localStorage.getItem("chord"));
  let synth = new Tone.PolySynth().toMaster();
  Tone.Transport.bpm.value = 120;
  synth.triggerAttackRelease(chord_list[play_key], '4n');
})


//クイズモード
//ヒントのコード名を表示
$(".chord").on("click",function(){
  $(".chord_text").html(code_name);
})

//キーボードを鳴らす
$("#keyboard li").on("click",function(){
  let sound = $(this).data('id');
  let sound_name;
  // 音源の「Tone.Synth()」を作り、マスター出力に接続
  let synth = new Tone.Synth().toMaster();
  // 中央の「ド(C4)」を4分音符で発音する
  synth.triggerAttackRelease(sound, '4n');
  ary.push(sound);
  sound_name = doremi[sound.slice(0, 1)];
  if(sound.length == 3) {
    sound_name = sound_name + "#";
  }
  $(".input").append(sound_name + " ");
})

//次の問題
$(".next").on("click",function(){
  question();
})

//決定ボタンで回答する
$(".answer").on("click",function(){
  //チャレンジした回数を増やして表示
  count += 1;
  $(".challenge span").html(count);
  //回答数をローカルストレージに保存
  localStorage.setItem("challenge_count",count);
  //問題の音の数と回答した音の数があっているか
  if(ary.length != q_chord.length){
    mistake();
    return;
  }
  //問題の音と回答した音があっているか（順不同）
  for(let i=0; i<ary.length; i++){
    let same = false;
    for(let j=0; j<q_chord.length; j++){
      if(ary[i] == q_chord[j]){
        same = true;
      }
    }
    if(same == false){
      mistake();
      return;
    }
    if(same == true && i == ary.length-1){
      success();
    }
  }
  ary = [];
  $(".input").html("");
  //正解数、ボーナスカウントをローカルストレージに保存
  localStorage.setItem("success_count",success_count);
  localStorage.setItem("bonus_count",bonus_count);
  localStorage.setItem("carrot_count",carrot_count);
})

//もう一回同じ問題音を鳴らす
$(".more").on("click",function(){
  $(".input").html("");
  ary = [];
  let synth = new Tone.PolySynth().toMaster();
  Tone.Transport.bpm.value = 120;
  synth.triggerAttackRelease(q_chord, '4n');
  $(".chord_text").html("？").css('font-size','40px');
  $(".rabit_img").animate({top:"-20px"}, 400).animate({top:"0px"}, 400);
});

//ボーナス人参からメロディを鳴らす
$(".carrot_img").on("click",function(){
  play_music();
})

//回答した音の確認
$(".check").on("click",function(){
  let synth = new Tone.PolySynth().toMaster();
  synth.triggerAttackRelease(ary, '4n');
});

function mistake() {
  //誤りの時の効果音を鳴らして、メッセージ表示
  addEffect();
  playEffect(fail);
  $(".chord_text").html("ざんねん！");
  $(".rabit_img").animate({ opacity: 1 }, {
    duration: 1700,
    step: function (now) {
      $(this).css({ transform: 'rotate(' + now * -20 + 'deg)' })
    }
  }).animate({ opacity: 1 }, {
    duration: 700,
    step: function (now) {
      $(this).css({ transform: 'rotate(' + now * 0 + 'deg)' })
    }
  });
  bonus_count = 0;
  localStorage.setItem("bonus_count",bonus_count);
}

function success() {
  //正解の時の効果音を鳴らして、メッセージ表示
  addEffect();
  playEffect(maru);
  $(".chord_text").html("当たり！");
  $(".rabit_img").animate({top:"-20px"}, 200).animate({top:"0px"}, 200);
  $(".rabit_img").animate({top:"-20px"}, 200).animate({top:"0px"}, 200);
  success_count += 1;
  bonus_count += 1;
  $(".point span").html(success_count);
  if(bonus_count >= 5){
    carrot_count += 1;
    if(carrot_count == 4) {
      $(".chord_text").html("にんじんを全部" + "<br>" + "ゲットしたよ").css('font-size','24px');
      bonus_count = 0;
    } else if (carrot_count > 4){
      $(".chord_text").html(bonus_count + "問連続正解だよ" + "<br>" + "天才！").css('font-size','24px');
    }
    else {
      $(".chord_text").html("にんじんを" + "<br>" + "ゲットしたよ").css('font-size','24px');
      bonus_count = 0;
    }
  }
  //ボーナス人参の表示
  $(".carrot_list li:nth-child(-n+"+carrot_count+")").css("visibility","visible");
}

function question() {
  ary = [];
  q_chord = [];
  let r = 0;
  $(".chord_text").html("").css('font-size','40px');
  $(".input").html("");

  let mode = $('input[name="mode"]:checked').val();
  const num = Math.random(); //小数点の乱数を生成
  if (mode == "harmony") {
    let chord_list = new Object();
    let chord_num = 0; 
    if(localStorage.getItem("chord")){
      chord_list = JSON.parse(localStorage.getItem("chord"));
      chord_num = Object.keys(chord_list).length;
    }
    const quiz_num = 12 + chord_num;
    const num = Math.random(); //小数点の乱数を生成
    r   = Math.floor(num * quiz_num); //繰り上げ

    if(r < 12) {
    q_chord.push(keyboard[r]);
      //randomで取得した音に対してメジャーコードの和音を追加する
      //和音２つ目
      q_chord.push(keyboard[r+4]);
      //和音３つ目
      q_chord.push(keyboard[r+7]);
      code_name = keyboard[r].slice(0,-1);
    } else {
      const list_key = Object.keys(chord_list)[r-12];
      q_chord = chord_list[list_key];
      code_name = list_key;
    }
  } else {
    r   = Math.floor(num * 12); //繰り上げ
    q_chord.push(keyboard[r]);
    code_name = keyboard[r].slice(0,-1);
  }
  $(".chord_text").html("？");
  $(".rabit_img").animate({top:"-20px"}, 400).animate({top:"0px"}, 400);
  let synth = new Tone.PolySynth().toMaster();
  Tone.Transport.bpm.value = 120;
  synth.triggerAttackRelease(q_chord, '4n');

}


function addMelodyA(time, note) {
  let melody_synthA = new Tone.PolySynth().toMaster();
  melody_synthA.triggerAttackRelease(note, '8n', time);

}

function addMelodyB(time,note) {
  let melody_synthB = new Tone.PolySynth().toMaster();
  melody_synthB.triggerAttackRelease(note, '8n', time);

}

function addMelodyC(time,note) {
  let melody_synthC = new Tone.PolySynth().toMaster();
  melody_synthC.triggerAttackRelease(note, '8n', time);

}

function addBass(time, note) {
  let bass_synth = new Tone.PolySynth().toMaster();
  bass_synth.triggerAttackRelease(note, '8n', time);

}

function addEffect(time,note) {
  let effect_synth = new Tone.PolySynth().toMaster();
  effect_synth.triggerAttackRelease(note, '8n', time);
}

function play_music() {
  //獲得した人参の数に合わせて重ねる音数を設定
  if(carrot_count >= 4) {
    let melody_a = new Tone.Sequence(addMelodyA, melody_dataA).start();
    melody_a.loop = false;
  }
  if(carrot_count >= 3) {
    let melody_b = new Tone.Sequence(addMelodyB, melody_dataB).start();
    melody_b.loop = false;
  }
  if(carrot_count >= 2) {
    let melody_c = new Tone.Sequence(addMelodyC, melody_dataC).start();
    melody_c.loop = false;
  }
  if(carrot_count >= 1) {
    let bass = new Tone.Sequence(addBass, bass_data).start();
    bass.loop = false;
  }

  // テンポを指定
  Tone.Transport.bpm.value = 120;
  Tone.Transport.start();
  for(let i=0; i<8; i++){
    $(".rabit_img").animate({top:"-20px"}, 470).animate({top:"0px"}, 470);
  }
}

function playEffect(effect_sound) {
  let melody_effect = new Tone.Sequence(addMelodyA, effect_sound).start();
  melody_effect.loop = false;
  Tone.Transport.bpm.value = 200;
  Tone.Transport.start();
}

function convertName(key_name) {
  let name_list = [];
  for(let i=0; i<key_name.length; i++){
    let sound_name = doremi[key_name[i].slice(0, 1)];
    if(key_name[i].length == 3) {
      sound_name = sound_name + "#";
    }
    name_list.push(sound_name);
  }
  return name_list;
}
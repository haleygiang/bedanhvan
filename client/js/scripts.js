function getPronunication(id, text) {
    $.ajax({
        type: 'POST',
        url: 'http://localhost:3000/api',
        data: { data: text },
        success:  response => {
            $("#" + id).html(`<audio class="d-none">
                                <source src="${response.async}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>`)
        },
        failure: response => console.log(response)
    })
}

function toggleAudio(id) {
    $("#" + id).find("audio")[0].play();
}

// SPELLING ALGO
const spelling_dict = {
    'a': 'a',
    'ă': 'á',
    'â': 'ớ',
    'b': 'bờ',
    'c': 'cờ',
    'd': 'dờ',
    'đ': 'đờ',
    'e': 'e',
    'ê': 'ê',
    'g': 'gờ',
    'h': 'hờ',
    'i': 'i',
    'k': 'cờ',
    'l': 'lờ',
    'm': 'mờ',
    'n': 'nờ',
    'o': 'o',
    'ô': 'ô',
    'ơ': 'ơ',
    'p': 'pờ',
    'q': 'cờ',
    'r': 'rờ',
    's': 'sờ',
    't': 'tờ',
    'u': 'u',
    'ư': 'ư',
    'v': 'vờ',
    'x': 'xờ',
    'y': 'i',
    'iê': 'i ê',
    'yê': 'i ê',
    'uô': 'u ô',
    'ươ': 'ư ơ',
    'ch': 'chờ',
    'kh': 'khờ',
    'nh': 'nhờ',
    'th': 'thờ',
    'ph': 'phờ',
    'gh': 'gờ',
    'ng': 'ngờ',
    'ngh': 'ngờ',
    'tr': 'trờ',
    'gi': 'giờ'
}

const huyền = 'huyền';
const sắc = 'sắc';
const hỏi = 'hỏi';
const ngã = 'ngã';
const nặng = 'nặng';

const signs_dict = {
    'àằầèềìòồờùừỳ': huyền,
    'áắấéếíóốớúứý': sắc,
    'ảẳẩẻểỉỏổởủửỷ': hỏi,
    'ãẵẫẽễĩõỗỡũữỹ': ngã,
    'ạặậẹệịọộợụựỵ': nặng
}

function _get_prefix_consonants(word){
    let prefix = '';
    for (let c of word.toLowerCase()){
        if ("BCDĐGHKLMNPQRSTVX".includes(c) || "BCDĐGHKLMNPQRSTVX".toLowerCase().includes(c)){
            prefix += c;
        }else{
            break;
        }
    }
    return [prefix, word.slice(prefix.length)];
}

const s1 = '\u00c0 \u00c1 \u00c2 \u00c3 \u00c8 \u00c9 \u00ca \u00cc \u00cd \u00d2 \u00d3 \u00d4 \u00d5 \u00d9 \u00da \u00dd \u00e0 \u00e1 \u00e2 \u00e3 \u00e8 \u00e9 \u00ea \u00ec \u00ed \u00f2 \u00f3 \u00f4 \u00f5 \u00f9 \u00fa \u00fd \u0102 \u0103 \u0110 \u0111 \u0128 \u0129 \u0168 \u0169 \u01a0 \u01a1 \u01af \u01b0 \u1ea0 \u1ea1 \u1ea2 \u1ea3 \u1ea4 \u1ea5 \u1ea6 \u1ea7 \u1ea8 \u1ea9 \u1eaa \u1eab \u1eac \u1ead \u1eae \u1eaf \u1eb0 \u1eb1 \u1eb2 \u1eb3 \u1eb4 \u1eb5 \u1eb6 \u1eb7 \u1eb8 \u1eb9 \u1eba \u1ebb \u1ebc \u1ebd \u1ebe \u1ebf \u1ec0 \u1ec1 \u1ec2 \u1ec3 \u1ec4 \u1ec5 \u1ec6 \u1ec7 \u1ec8 \u1ec9 \u1eca \u1ecb \u1ecc \u1ecd \u1ece \u1ecf \u1ed0 \u1ed1 \u1ed2 \u1ed3 \u1ed4 \u1ed5 \u1ed6 \u1ed7 \u1ed8 \u1ed9 \u1eda \u1edb \u1edc \u1edd \u1ede \u1edf \u1ee0 \u1ee1 \u1ee2 \u1ee3 \u1ee4 \u1ee5 \u1ee6 \u1ee7 \u1ee8 \u1ee9 \u1eea \u1eeb \u1eec \u1eed \u1eee \u1eef \u1ef0 \u1ef1 \u1ef2 \u1ef3 \u1ef4 \u1ef5 \u1ef6 \u1ef7 \u1ef8 \u1ef9'.split(' ')
const s0 = '\u0041 \u0041 \u00c2 \u0041 \u0045 \u0045 \u00ca \u0049 \u0049 \u004f \u004f \u00d4 \u004f \u0055 \u0055 \u0059 \u0061 \u0061 \u00e2 \u0061 \u0065 \u0065 \u00ea \u0069 \u0069 \u006f \u006f \u00f4 \u006f \u0075 \u0075 \u0079 \u0102 \u0103 \u0110 \u0111 \u0049 \u0069 \u0055 \u0075 \u01a0 \u01a1 \u01af \u01b0 \u0041 \u0061 \u0041 \u0061 \u00c2 \u00e2 \u00c2 \u00e2 \u00c2 \u00e2 \u00c2 \u00e2 \u00c2 \u00e2 \u0102 \u0103 \u0102 \u0103 \u0102 \u0103 \u0102 \u0103 \u0102 \u0103 \u0045 \u0065 \u0045 \u0065 \u0045 \u0065 \u00ca \u00ea \u00ca \u00ea \u00ca \u00ea \u00ca \u00ea \u00ca \u00ea \u0049 \u0069 \u0069 \u004f \u006f \u004f \u006f \u00d4 \u00f4 \u00d4 \u00f4 \u00d4 \u00f4 \u00d4 \u00f4 \u00d4 \u00f4 \u01a0 \u01a1 \u01a0 \u01a1 \u01a0 \u01a1 \u01a0 \u01a1 \u01a0 \u01a1 \u0055 \u0075 \u0055 \u0075 \u01af \u01b0 \u01af \u01b0 \u01af \u01b0 \u01af \u01b0 \u01af \u01b0 \u0059 \u0079 \u0059 \u0079 \u0059 \u0079 \u0059 \u0079 \u0027'.split(' ')

function _remove_accents(input_str){
    let s = '';
    for (let c of input_str){
        if(s1.includes(c)){
            s += s0[s1.indexOf(c)];
        }else{
            s += c;
        }
    }
    return s;
}

function items(obj) {
    var i, arr = [];
    for(i in obj) {
      arr.push(obj[i]);
    }
    return arr;
}

function _detect_sign(word){
    for (let c of word.toLowerCase()){
      for (let [matches, sign] of Object.entries(signs_dict)){
        if(matches.includes(c)){
          return sign;
        }
      }
    }
    return '';
}

function to_spelling(phrase){
    if (phrase.length == 0){
        return ''
    }

    words = phrase.trim().split(/[ ,]+/);
    result = ''
    for (let word of words) {
        let res = _get_prefix_consonants(word);
        let consonants = res[0];
        let remaining = res[1];
        let part_consonants = spelling_dict[consonants];
    
        let part_remaining = _remove_accents(remaining);
        let part_full = _remove_accents(word);
    
        let part_sign = _detect_sign(word);
    
        result += part_consonants + ' ' + part_remaining + (part_sign != '' ? ' ' + part_full + ' ' + part_sign : '') + ' ' + word + '\n';
    }
   
    return result;
}

getPronunication('audio-1', to_spelling('Con gà'));
getPronunication('audio-2', to_spelling('Con bò'));
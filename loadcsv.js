// ==UserScript==
// @name         LoadCSV
// @namespace    https://blog.oimaster.ml/
// @version      1.0
// @description  在 OIMOJ 比赛榜单上显示导出 vijos csv 选项
// @author       oimasterakioi
// @icon         https://yun.oimaster.ml/favicon.ico
// @grant        none
// @match        https://yun.oimaster.ml/contest/*/ranklist
// ==/UserScript==

$(function(){
    console.log('run');

    // get scoreboard
    var tmp = $('table.ui.very.basic.center.aligned.table')[0];
    console.debug(tmp);

    var header = $(tmp).children('thead').children('tr');
    console.debug(header);

    var problems = [];
    $(header).children('th').each(function(){
        console.debug($(this));
        // check children
        // has <a> element
        // == problem

        var isProblem = $(this).children('a');
        if(isProblem.length != 0){
            // found <a> element
            // is a problem

            problems.push($(isProblem[0]).text().trim());
        }
    });

    console.debug(problems);

    var problemstr = "";

    for(var i=0; i<problems.length; ++i){
        var id = i + 1;
        problemstr = problemstr + ',#'+ id + ' ' + problems[i];
    }

    var csvData = "";
    csvData += ("排名,用户,显示名,总分数" + problemstr) + '\n';

    // finished header
    // start parse ranking

    var body = $(tmp).children('tbody').children('tr');
    console.debug(body);

    for(var i=0; i<body.length; ++i){
        var rank = i+1;
        var info = $(body[i]).children('td');

        console.debug(info);

        // get username
        var username = $(info[1]).text().trim();
        console.debug(username);

        // get score for all the problems
        var scores = [];
        for(var j = 2; j < 2 + problems.length; ++j){
            try{
                var tmpscore = $($(info[j]).children('a')[0]).text().trim();
                if(tmpscore == "")
                    throw "no submission";
                scores.push(tmpscore);
            }catch(e){
                scores.push('-');
            }
        }
        console.debug(scores);

        var totalScore = $($(info[2+problems.length]).children('span')[0]).text().trim();
        console.debug(totalScore);

        csvData += (rank + ',' + username + ',,' + totalScore + ',' + scores.join(',')) + '\n';

    }

    // https://www.jianshu.com/p/5d30c2eff775
    // please use chrome
    var alink = document.createElement("a");
    var _utf = "\uFEFF";
    if (window.Blob && window.URL && window.URL.createObjectURL) {
        const csvDataBlob = new Blob([_utf + csvData], {
            type: "text/csv",
        });
        alink.href = URL.createObjectURL(csvDataBlob);
    }
    alink.setAttribute("download", "ranking.csv");
    alink.innerText="导出 Vijos CSV 文件";

    var center = document.createElement("center");
    center.appendChild(alink);

    $('h1.ui.center.aligned.header').after(center);
});

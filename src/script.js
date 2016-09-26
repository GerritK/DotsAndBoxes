$(document).ready(function () {
    var lines = [];
    var boxes = [];
    var player = 0;
    var computer = 2;

    function init(width, height) {
        lines = [];
        boxes = [];

        for(var x = 0; x < width; x++) {
            boxes[x] = [];

            lines[x * 2] = [];
            lines[x * 2 + 1] = [];

            if(x == width - 1) {
                lines[x * 2 + 2] = [];
            }

            for(var y = 0; y < height; y++) {
                boxes[x][y] = 0;

                lines[x * 2][y] = 0;
                lines[x * 2 + 1][y] = 0;

                if(x == width - 1) {
                    lines[x * 2 + 2][y] = 0;
                }
                if(y == height - 1) {
                    lines[x * 2 + 1][y + 1] = 0;
                }
            }
        }

        nextPlayer();
        initPlayground();
        drawPlayground();
        turn();
    }

    function initPlayground() {
        var playground = $(".playground");
        playground.empty();

        for(var x = 0; x < boxes.length; x++) {
            var lineColumn = $("<div class='column'></div>");
            var column = $("<div class='column'></div>");
            var lastLineColumn = null;

            if(x == boxes.length - 1) {
                lastLineColumn = $("<div class='column'></div>");
            }

            for(var y = 0; y < boxes[x].length; y++) {
                lineColumn.append("<div class='dot'></div>");
                lineColumn.append("<div class='line vertical' id='line_" + (x * 2) + "_" + y + "'></div>");

                if(lastLineColumn != null) {
                    lastLineColumn.append("<div class='dot'></div>");
                    lastLineColumn.append("<div class='line vertical' id='line_" + (x * 2 + 2) + "_" + y + "'></div>");

                    if(y == boxes[x].length - 1) {
                        lastLineColumn.append("<div class='dot'></div>");
                    }
                }

                column.append("<div class='line horizontal' id='line_" + (x * 2 + 1) + "_" + y + "'></div>");
                column.append("<div class='box' id='box_" + x + "_" + y + "'></div>");

                if(y == boxes[x].length - 1) {
                    column.append("<div class='line horizontal' id='line_" + (x * 2 + 1) + "_" + (y + 1) + "'></div>");
                    lineColumn.append("<div class='dot'></div>");
                }
            }

            playground.append(lineColumn);
            playground.append(column);
            if(lastLineColumn != null) {
                playground.append(lastLineColumn);
            }
        }

        $(".playground .line").click(function () {
            var coords = $(this).attr("id").split("_");
            if(player != computer && markLine(parseInt(coords[1]), parseInt(coords[2]))) {
                drawPlayground();
                turn();
            }
        });
    }

    function drawPlayground() {
        $(".board #score_1").text(getScore(1));
        $(".board #score_2").text(getScore(2));

        if(player == 1) {
            $("#player_1").addClass("turn");
            $("#player_2").removeClass("turn");
        } else if(player == 2) {
            $("#player_2").addClass("turn");
            $("#player_1").removeClass("turn");
        } else {
            $("#player_1").removeClass("turn");
            $("#player_2").removeClass("turn");
        }

        for(var x = 0; x < boxes.length; x++) {
            for(var y = 0; y < boxes[x].length; y++) {
                var box = boxes[x][y];
                var elem = $("#box_" + x + "_" + y);

                setClass(elem, box);
            }
        }

        for(x = 0; x < lines.length; x++) {
            for(y = 0; y < lines[x].length; y++) {
                var line = lines[x][y];
                elem = $("#line_" + x + "_" + y);

                setClass(elem, line);
            }
        }
    }

    function setClass(elem, player) {
        if(player == 1) {
            elem.addClass("blue");
            elem.removeClass("red");
        } else if(player == 2) {
            elem.addClass("red");
            elem.removeClass("blue");
        } else {
            elem.removeClass("blue");
            elem.removeClass("red");
        }
    }

    function markLine(x, y) {
        if(lines[x][y] == 0) {
            lines[x][y] = player;

            var gotPoint = false;
            var lineBoxes = getBoxesForLine(x, y);
            for(var i = 0; i < lineBoxes.length; i++) {
                var box = lineBoxes[i];

                if(isBoxCircled(box.x, box.y)) {
                    boxes[box.x][box.y] = player;
                    gotPoint = true;
                }
            }

            if(!gotPoint) {
                nextPlayer();
            }
            return true;
        }
        return false;
    }

    function turn() {
        if(getScore(0) == 0) {
            player = 0;
            drawPlayground();
            setTimeout(function () {
                if(getScore(1) > getScore(2)) {
                    alert("Player 1 wins!");
                } else if(getScore(2) > getScore(1)) {
                    alert("Player 2 wins!");
                } else {
                    alert("Draw");
                }
            }, 250);
        } else {
            if (player == computer) {
                setTimeout(computerTurn, 500);
            }
        }
    }

    function nextPlayer() {
        if(player == 1) {
            player = 2;
        } else if(player == 2) {
            player = 1;
        } else {
            player = random(1, 3);
        }
    }

    function getLineClass(x, y) {
        if(lines[x][y] == 1) {
            return "blue";
        } else if(lines[x][y] == 2) {
            return "red";
        }
        return "";
    }

    function getBoxClass(x, y) {
        if(boxes[x][y] == 1) {
            return "blue";
        } else if(boxes[x][y] == 2) {
            return "red";
        }
        return "";
    }

    function getBoxesForLine(x, y) {
        var boxes = [];

        if(x % 2 == 0) {
            if(x > 0) {
                boxes.push({x: x / 2 - 1, y: y});
            }
            if(x < lines.length - 1) {
                boxes.push({x: x / 2, y: y});
            }
        } else {
            if(y > 0) {
                boxes.push({x: (x - 1) / 2, y: y - 1});
            }
            if(y < lines[x].length - 1) {
                boxes.push({x: (x - 1) / 2, y: y})
            }
        }

        return boxes;
    }

    function getLinesForBox(x, y) {
        return [
            {x: x * 2, y: y},
            {x: x * 2 + 1, y: y},
            {x: x * 2 + 2, y: y},
            {x: x * 2 + 1, y: y + 1}
        ]
    }

    function isBoxCircled(x, y) {
        var result = true;

        var boxLines = getLinesForBox(x, y);
        for(var i = 0; i < boxLines.length; i++) {
            var line = boxLines[i];
            result = result && lines[line.x][line.y] > 0;
        }

        return result;
    }

    function getScoreLines(state) {
        var result = [];

        if(state === undefined) {
            state = "score";
        }

        for(var x = 0; x < lines.length; x++) {
            for(var y = 0; y < lines[x].length; y++) {
                if(lines[x][y] == 0) {
                    var lineBoxes = getBoxesForLine(x, y);

                    var passed = true;
                    for(var i = 0; i < lineBoxes.length; i++) {
                        if(state == "play") {
                            passed = passed && getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length > 2;
                        } else if(state == "risk") {
                            passed = passed && getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length >= 2;
                        } else if(state == "score") {
                            if(getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length == 1) {
                                passed = true;
                                break;
                            } else {
                                passed = false;
                            }
                        }
                    }

                    if(passed) {
                        result.push({x: x, y: y});
                    }
                }
            }
        }

        return result;
    }

    function getUnmarkedLinesForBox(x, y) {
        var boxLines = getLinesForBox(x, y);
        var result = [];

        for(var n = 0; n < boxLines.length; n++) {
            var line = boxLines[n];
            if(lines[line.x][line.y] == 0) {
                result.push(line);
            }
        }

        return result;
    }

    function getScore(player) {
        var score = 0;

        for(var x = 0; x < boxes.length; x++) {
            for(var y = 0; y < boxes[x].length; y++) {
                if(boxes[x][y] == player) {
                    score++;
                }
            }
        }

        return score;
    }

    function getRandomLine(lines) {
        return lines[random(0, lines.length)];
    }

    function getLowestRiskLine() {
        var riskLines = getScoreLines("risk");
        var result;
        var minRisk = null;
        var secondTry = false;

        for(var i = 0; i < riskLines.length; i++) {
            var risk = 0;
            var line = riskLines[i];
            var currentLine = line;
            var currentBox = null;

            if(secondTry) {
                if(line.checked == true) {
                    continue;
                }
            } else {
                if(i == riskLines.length - 1) {
                    secondTry = true;
                    i = 0;
                }

                if (line.checked == true || getBoxesForLine(line.x, line.y).length > 1) {
                    continue;
                }
            }

            while(currentLine != null) {
                var nextLineResult = getNextLine(currentLine, currentBox);

                for(var n = 0; n < riskLines.length; n++) {
                    if(riskLines[n].x == currentLine.x && riskLines[n].y == currentLine.y) {
                        riskLines[n].checked = true;
                    }
                }

                currentLine = nextLineResult.line;
                currentBox = nextLineResult.box;
                risk++;

                if(currentLine != null && currentLine.x == line.x && currentLine.y == line.y) {
                    currentLine = null;
                }
            }

            if(minRisk === null || risk < minRisk) {
                minRisk = risk;
                result = line;
            }
        }

        return result;
    }

    function getNextLine(prevLine, prevBox) {
        var lineBoxes = getBoxesForLine(prevLine.x, prevLine.y);

        var box = null;
        var line = null;

        for(var i = 0; i < lineBoxes.length; i++) {
            if (prevBox == null || lineBoxes[i].x != prevBox.x || lineBoxes[i].y != prevBox.y) {
                box = lineBoxes[i];
            }
        }

        if(box != null) {
            var unmarkedLines = getUnmarkedLinesForBox(box.x, box.y);
            if(unmarkedLines.length == 2) {
                for(i = 0; i < unmarkedLines.length; i++) {
                    if(unmarkedLines[i].x != prevLine.x || unmarkedLines[i].y != prevLine.y) {
                        line = unmarkedLines[i];
                    }
                }
            }
        }

        return {box: box, line: line};
    }

    function computerTurn() {
        var line = {x: 0, y: 0};

        var scoreLines = getScoreLines();
        if(scoreLines.length > 0) {
            line = scoreLines[random(0, scoreLines.length)];
        } else {
            scoreLines = getScoreLines("play");
            if(scoreLines.length > 0) {
                line = getRandomLine(scoreLines);
            } else {
                var start = performance.now();
                line = getLowestRiskLine();
                console.log(performance.now() - start);
            }
        }

        if(!markLine(line.x, line.y)) {
            computerTurn();
        } else {
            drawPlayground();
            turn();
        }
    }

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    init(14, 8);
});
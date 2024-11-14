import './sudoku.cpp'
var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);

	}
}


var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j]
			}

			else
				arr[i][j].innerText = ''
		}
	}
}

 GetPuzzle = document.getElementById('GetPuzzle')
 SolvePuzzle = document.getElementById('SolvePuzzle')

/*GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest()
	xhrRequest.onload = function () {
		var response = JSON.parse(xhrRequest.response)
		console.log(response)
		board = response.board
		FillBoard(board)
	}
	xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy')
	//we can change the difficulty of the puzzle the allowed values of difficulty are easy, medium, hard and random
	xhrRequest.send()
}*/

GetPuzzle.onclick = function () {
    // Toggle this variable to switch between APIs
    const useSugokuAPI = true;  

    if (useSugokuAPI) {
        // Fetch from Sugoku API
        var xhrRequest = new XMLHttpRequest();
        xhrRequest.onload = function () {
            try {
                var response = JSON.parse(xhrRequest.response);
                console.log("Sugoku API Response:", response);
                board = response.board;
                FillBoard(board);
            } catch (error) {
                console.error("Error parsing Sugoku API response:", error);
            }
        };
        xhrRequest.onerror = function () {
            console.error("Error with Sugoku API request.");
        };
        xhrRequest.open('get', 'https://sugoku.herokuapp.com/board?difficulty=easy');
        xhrRequest.send();
    } else {
        // Fetch from YouDoSudoku API
        fetch("https://youdosudoku.com/api/")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Network error: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("YouDoSudoku API Response:", data);
                board = data.board || data.puzzle || []; // Adjust based on actual response structure
                FillBoard(board);
            })
            .catch(error => {
                console.error("Fetch error with YouDoSudoku API:", error);
            });
    }
};


SolvePuzzle.onclick = () => {
	SudokuSolver(board, 0, 0);
};


function isValid(board, r, c, num) {
    for( let i=0;i<9;i++) {
        if(board[i][c]==num ||board[r][i]==num) {
            return false;
        }
    }
    let rn=Math.sqrt(9);
    let r1=r-r%rn,c1=c-c%rn;
    for( let k=r1;k<r1+rn;k++) {
        for( let l=c1;l<c1+rn;l++) {
            if(board[k][l]==num) {
                return false;
            }
        }
    }
    return true;
}

function SudokuSolver(board, i, j) {
    if(i==9) {
        FillBoard(board)
        return true;
    }
    if(j==9) {
        return SudokuSolver(board,i+1,0);
    }
    if(board[i][j]!=0) {
        return SudokuSolver(board,i,j+1);
    }

    for( let num=1;num<=9;num++) {
        if(isValid(board,i,j,num)) {
            board[i][j]=num;
            let sudtest=SudokuSolver(board,i,j+1);
            if(sudtest) {
                return true;
            }
            board[i][j]=0;
        }
    }
    return false;
}

/*
  Sudoku Solver-v0.0.1
*/
const cols = 9;
const rows = 9;
var question_arr = [], pencil_marks = [];
for(var i=0;i<rows;i++){
  question_arr.push(Array(cols));
  pencil_marks.push(Array(cols));
}

/***************************************************Code to interact with and check the html********************************************************/

window.addEventListener('keydown',key=>{  //changing input position based on current cursor position
  let currentPosId= key.srcElement.id;
  let row = currentPosId.charAt(currentPosId.length-2);
  let col = currentPosId.charAt(currentPosId.length-1);
  if(key.key == 'ArrowLeft'){
    if(row == 0 && col == 0)
      return;
    else if(row == 0)
      document.getElementById(`main0${--col}`).focus();
    else if(col == 0)
      document.getElementById(`main${--row}8`).focus();
    else
      document.getElementById(`main${row}${--col}`).focus();
  }
  else if(key.key == 'ArrowRight'){
    if(row == 8 && col == 8)
      return;
    else if(row == 8)
      document.getElementById(`main8${++col}`).focus();
    else if(col == 8)
      document.getElementById(`main${++row}0`).focus();
    else
      document.getElementById(`main${row}${++col}`).focus();
  }
  else if(key.key == 'ArrowUp'){
    if(row == 0)
      return;
    else
      document.getElementById(`main${--row}${col}`).focus();
  }
  else if(key.key == 'ArrowDown'){
    if(row == 8)
      return;
    else
      document.getElementById(`main${++row}${col}`).focus();
  }
});

const getProblem = () => {    //get the inputs and fill in the array. If any input is invalid type, break and return err
  let errorClassList = document.getElementById('error').classList;
  let err = false;
  var currNum,currField;
  for(var i=0;i<rows;i++){
    for(var j=0;j<cols;j++){
      currField = document.getElementById(`main${i}${j}`)
      if(currField.value.match(/^[1-9]$/)){
        question_arr[i][j] = parseInt(currField.value);
        pencil_marks[i][j] = [];
      }
      else if(currField.value == ''){
        question_arr[i][j] = undefined;
        pencil_marks[i][j] = [...Array(cols).keys()].map(i=>i+1)
      }
      else{
        err = true;
        errorClassList.remove('d-none');
        break;
      }
    }
  }
  if(!err)
    errorClassList.add('d-none');
  return !err;
};

const renderSolGrid = () => {
  var sol = document.getElementById('solution');
  sol.innerHTML = '';
  for(var i=0;i<rows;i++){
    let str = '';
    for(var j=0;j<cols;j++){
        str += `<div class="col ${(i==3 || i==4 || i== 5 || j==3 || j==4 || j== 5)?'bg-warning':'bg-secondary'}" row="${i}" col="${j}">${question_arr[i][j]?question_arr[i][j]:'.'}</div>`;
    }
    sol.innerHTML += `<div class="row flex-nowrap">${str}</div>`;
  }
};

/**************************************************************************************************************************************************/


/********************************************************Code to find the solution*****************************************************************/

const getSubGridElemsByElem = (x,y) => { //takes x and y coords of the element and returns array of its subgrid elems
  let grid = 3*Math.floor(x/3) + Math.floor(y/3),arr = [];
  let elemX = 3*Math.floor(grid/3),elemY = (grid%3)*3;
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      arr.push([elemX+i,elemY+j])
    }
  }
  return arr;
};

const getSubGridArr = (grid) => {  //return array of a 3x3 grid elements
  let arr = [],x = 3*Math.floor(grid/3),y = (grid%3)*3;
  for(var i=0;i<3;i++){
    for(var j=0;j<3;j++){
      arr.push(question_arr[x+i][y+j])
    }
  }
  return arr;
};

const getColArr = (col) => {  //return array of a column elements
  let arr = [];
  for(var i=0;i<cols;i++){
    arr.push(question_arr[i][col]);
  }
  return arr;
};

const find_missing_digit = (arr) => { // just solves checks if one element left, and if so, returns the value
  let count = 0,sum = 0;
  for(var i=0;i<9;i++){   //fixing length to 9 since current rows, columns and subgrids have exactly 9 elements in a 9x9 sudoku
    if(!arr[i])
      count++;
    else
      sum += arr[i];
    if(count>1)
      break;
  }
  if(count!=1)
    return null;
  return 45-sum;
};

const solve_a_sub_grid = (grid) => {
  let subGridArr = getSubGridArr(grid);
  let missingDigit = find_missing_digit(subGridArr);
  if(missingDigit){ //just checks for a single missing digit and not more than that OPEN-SINGLES
    //if missing digit found, place it in
    let idx = subGridArr.findIndex(num=>num == null || num == undefined);
    question_arr[3*Math.floor(grid/3)+Math.floor(idx/3)][3*(grid%3)+(idx%3)] = missingDigit;
  }
  else{
    //next method
  }
};

const solve_a_row = (row) => {
  let missingDigit = find_missing_digit(question_arr[row]);
  if(missingDigit){ //just checks for a single missing digit and not more than that OPEN-SINGLES
    //if missing digit found, place it in
    let idx = question_arr[row].findIndex(num=>num == null || num == undefined);
    question_arr[row][idx] = missingDigit;
  }
  else{
    //next method
  }
};

const solve_a_col = (col) => {
  let colArr = getColArr(col);
  let missingDigit = find_missing_digit(colArr);
  if(missingDigit){ //just checks for a single missing digit and not more than that OPEN-SINGLES
    //if missing digit found, place it in
    let idx = colArr.findIndex(num=>num == null || num == undefined);
    question_arr[idx][col] = missingDigit;
  }
  else{
    //next method
  }
};

const solveSubGrids = () => {
  for(var i=0;i<rows;i++){
    if(getSubGridArr(i).findIndex(num=>num==undefined) > -1)
      solve_a_sub_grid(i);
  }
};

const solveColumns = () => {
  for(var i=0;i<cols;i++){
    if(getColArr(i).findIndex(num=>num==undefined) > -1)
      solve_a_col(i);
  }
};

const solveRows = () => {
  for(var i=0;i<rows;i++){
    if(question_arr[i].findIndex(num=>num==undefined) > -1)
      solve_a_row(i);
  }
};

const removePencilMarks = () => {   //will remove pencil marks after any solution is found and will initially run on solution() function
  const step1 = () => {
    let solution = [];
    for(var i=0;i<rows;i++){
      solution.push(Array(cols));
    }
    for(var i=0;i<rows;i++){
      for(var j=0;j<cols;j++){
        solution[i][j] = question_arr[i][j];  //copying each element of question_arr so that it later can be compared and checked if question_arr has been updated but pencil marks not removed
        if(question_arr[i][j]){ //if some value exists
          for(var ii=0;ii<rows;ii++){ //removing pencil marks from the row
            pencil_marks[i][ii] = pencil_marks[i][ii].filter(item=>item!=question_arr[i][j]);
          }
          for(var jj=0;jj<cols;jj++){ //removing pencil marks from the col
            pencil_marks[jj][j] = pencil_marks[jj][j].filter(item=>item!=question_arr[i][j]);
          }
          let l = getSubGridElemsByElem(i,j); // l=elements To Eliminate
          for(let k=0;k<l.length;k++){ //removing pencil marks from the subgrid here
            pencil_marks[l[k][0]][l[k][1]] = pencil_marks[l[k][0]][l[k][1]].filter(item=>item!=question_arr[i][j]);
          }
        }
        if(!question_arr[i][j] && pencil_marks[i][j].length == 1){  // if any pencil mark array is left with only one element, hence it is the only solution there and hence removing pencil mark and adding it to the solution
          question_arr[i][j] = pencil_marks[i][j][0];
          pencil_marks[i][j].pop();
        }
      }
    }
    if(JSON.stringify(solution)!=JSON.stringify(question_arr)){
      step1();  //if question_arr changes then again remove pencil marks recursively until they become the same and no more solutions can be found
    }
    step2();
  };
  const step2 = () => {
    let changes = false;
    for(var i=0;i<pencil_marks.length;i++){
      for(var j=0;j<pencil_marks[i].length;j++){
        if(!question_arr[i][j] && pencil_marks[i][j].length == 1){
          question_arr[i][j] = pencil_marks[i][j][0];
          pencil_marks[i][j].pop();
          changes = true;
          break;
        }
      }
    }
    if(changes)
      step1();
  };
  step1();
  console.log(pencil_marks);
};

const solution = () => {
  if(!getProblem()) //if any problem occurs in the inputs, break the code
    return;
  removePencilMarks();  // remove pencil marks from a row, column and subgrid when we find a block solved
  //solveRows();
  //solveColumns();
  //solveSubGrids();  //removed these three functions since removePencilMarks function does that already


  renderSolGrid();
};

window.onload = () => {
  var main = document.getElementById('main');
  for(var i=0;i<rows;i++){
    let str = '';
    for(var j=0;j<cols;j++){
        str += `<input type="text" pattern="^[1-9]{1}$" class="col ${(i==3 || i==4 || i== 5 || j==3 || j==4 || j== 5)?'bg-warning':'bg-secondary'}" row="${i}" col="${j}" id="main${i}${j}">`;
    }
    main.innerHTML += `<div class="row">${str}</div>`;
  }
};

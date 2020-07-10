import React, {Component, forwardRef} from "react";
import Cell from "./Cell";
import './Board.css';


/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - hasWon: boolean, true when board is all off
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

class Board extends Component {
  static defaultProps = {
    nrows: 5,
    ncols: 5,
    chanceLightStartsOn: 0.5
  }
  constructor(props) {
    super(props);
    this.state = {
      hasWon: false,
      board: this.createBoard()
    };
    this.flipCellsAround=this.flipCellsAround.bind(this)
  }

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */

  createBoard() {
    let board = new Array(this.props.nrows);
    let aux;
    for(let i=0;i<board.length;i++){
      board[i]=new Array(this.props.ncols);
      for(let j=0; j<board[i].length; j++){
        aux=Math.random();
        if(aux<=this.props.chanceLightStartsOn) board[i][j]=true;
        else board[i][j]=false;
      }
    }
    return board;
  }

  /** handle changing a cell: update board & determine if winner */

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);
    let hasWon=true;


    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    flipCell(y,x);
    flipCell(y+1,x);
    flipCell(y-1,x);
    flipCell(y,x+1);
    flipCell(y,x-1);

    // win when every cell is turned off
    // TODO: determine is the game has been won
    for(let i=0;i<board.length;i++){
      for(let j=0;j<board[i].length;j++){
          if(hasWon===false) break;
        if(board[i][j]===true){
          hasWon=false;
          break;
        } 
      }
    }
    this.setState({board, hasWon});
  }

  /** Render game board or winning message. */
  reset = ()=>{
    this.setState({hasWon: false, board: this.createBoard()});
  }

  render() {
    return(
      <div className="Board">
      <h1><span className="Board-title1">LIGHTS</span><span className="Board-title2">OUT</span></h1>
      {
          this.state.hasWon
        ? <h2><span className="Board-title2">YOU</span> <span className="Board-title1">WIN</span></h2>
        : <div className="Board-tableGradient">
            <table>
              <tbody>
                {this.state.board.map((row,rowidx)=>
                  <tr key={rowidx}>
                    {row.map((column,colidx)=><Cell key={`${colidx}-${rowidx}`} isLit={column} flipCellsAroundMe={this.flipCellsAround} coords={`${rowidx}-${colidx}`}/>)}
                  </tr>)}
              </tbody>
            </table>
          </div>
      }
      <div className="Board-button">
        <button className="Board-button-reset" onClick={this.reset}>RESET</button>
      </div>
      </div>
    )
  }
}


export default Board;

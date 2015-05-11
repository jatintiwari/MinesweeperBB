package com.minesweeper.game.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.minesweeper.game.model.Cell;
import com.minesweeper.game.service.MyGameService;

@Controller
@RequestMapping(value="cells")
public class GameController {

	@Autowired
	MyGameService myGameService;

	JSONObject jsonObject;
	ObjectMapper objectMapper;
	boolean gameOver;
	short validFlag=0;
	short inValidFlag=0;
	int turns=0;
	int gridSize=0;
	static List<Cell> listOfCells;

	@RequestMapping(value="create", method=RequestMethod.POST)
	public @ResponseBody String newGame(@RequestParam("rowSize") short rowSize){
		try{
			int mineCount=0;
			this.gridSize=rowSize*rowSize;
			listOfCells= new ArrayList<Cell>();
			Random r = new Random();

			for(int cellCount=0;cellCount<gridSize;cellCount++){
				char c = r.nextBoolean() ? 'x' : 'm';
				Cell cell = new Cell();
				cell.setId(cellCount);
				if(c=='m'){
					mineCount++;
					cell.setMine(true);
				}else if(c=='0'){
					cell.setMine(false);
				}
				listOfCells.add(cell);
				gameOver=false;
			}
			for(Cell cell:listOfCells){
				System.out.println(cell);
			}
			System.out.println("Mines: "+mineCount);
			return "{\"success\":\"true\",\"gridSize\":\""+this.gridSize+"\"}";
		}catch(Exception e){
			return "{\"success\":\"false\",\"message\":\"Grid not created\"}";
		}
	}
	@RequestMapping(value="{id}",method=RequestMethod.PUT)
	public @ResponseBody String getCell(@RequestBody String inCell){
		try{
			System.out.println("Incoming: "+inCell);
			if(!gameOver){
				objectMapper= new ObjectMapper();
				Cell cellInfo=	objectMapper.readValue(inCell, Cell.class);
				Cell cell=listOfCells.get(cellInfo.getId());
				if(!cell.isOpen()){
					System.out.println("line 80");
					jsonObject= new JSONObject();
					cell.setOpen(true);
					jsonObject.put("id", cell.getId());
					jsonObject.put("open", cellInfo.isOpen());
					if(cellInfo.isFlag() && cell.isMine()){
						cell.setFlag(true);
						jsonObject.put("flag", cellInfo.isFlag());
						validFlag++;
					}else if(cellInfo.isFlag() && !cell.isMine()){
						cell.setFlag(true);
						jsonObject.put("mine", cell.isMine());
						jsonObject.put("flag", cellInfo.isFlag());
						inValidFlag++;
					}else if(!cellInfo.isFlag() && cell.isMine()){
						jsonObject.put("mine", cell.isMine());
						jsonObject.put("flag", cellInfo.isFlag());
						jsonObject.put("message", "<p>Oops!! You stepped on a mine!</p> "+
												"<p> Click on <span style=\"color:white\">New Game</span> to start again</p>");
						gameOver=true;
					}
					turns++;
					System.out.println(gameOver);
					System.out.println(turns==gridSize);
					System.out.println((inValidFlag==0));
					if(!gameOver&&(turns==gridSize)&& (inValidFlag==0)){
						jsonObject.put("message", "Hurray you have won the game!");
						jsonObject.put("win", "true");
						gameOver=true;
					}else if(!gameOver &&(turns==gridSize)&& (inValidFlag>0)){
						jsonObject.put("message", "You placed flags on cells which where not mines, Better luck next time");
						jsonObject.put("finish", "true");
						gameOver=true;
					}
					System.out.println("Outgoing cell info: "+jsonObject.toString()+":::: Cell: "+cell);
					return jsonObject.toString(); 
				}else{
					System.out.println("line 108");
					return "{\"success\":\"false\",\"message\":\"Cell is open\"}";
				}
			}else{
				return "{\"success\":\"false\",\"message\":\"Game finished\"}";
			}
		}catch(Exception e){
			e.printStackTrace();
			return "{\"success\":\"false\",\"message\":\"Cell not found\"}";
		}finally{
			if(gameOver){
				System.out.println("Game Ended");
				System.out.println("Turns: "+turns);
				System.out.println("Valid Flags: "+validFlag);
				System.out.println("Invalid Flags: "+inValidFlag);
				endGame();
			}
		}
	}

	void endGame(){
		turns=0;
		inValidFlag=0;
		validFlag=0;
		listOfCells=null;
	}

}

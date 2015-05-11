package test;

import java.util.Random;

public class Mygame {

		public static void main(String[] ar){
			Random r = new Random();
			char c = r.nextBoolean() ? '0' : 'm';
			
			System.out.println(c);
		}

}

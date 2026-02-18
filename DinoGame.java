public import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.Random;

public class DinoGame extends JPanel implements ActionListener, KeyListener {
    // Configuración de la ventana
    private int boardWidth = 700;
    private int boardHeight = 250;

    // Lógica del Dino
    int dinoWidth = 40;
    int dinoHeight = 40;
    int dinoX = 50;
    int dinoY = boardHeight - dinoHeight;
    int velocityY = 0;
    int gravity = 1;

    // Obstáculos (Cactus)
    int cactusWidth = 20;
    int cactusHeight = 40;
    int cactusX = 700;
    int cactusY = boardHeight - cactusHeight;
    ArrayList<Rectangle> cacti = new ArrayList<>();

    Timer gameLoop;
    Timer placeCactusTimer;
    boolean gameOver = false;

    public DinoGame() {
        setPreferredSize(new Dimension(boardWidth, boardHeight));
        setBackground(Color.WHITE);
        setFocusable(true);
        addKeyListener(this);

        // Bucle del juego (60 FPS aprox)
        gameLoop = new Timer(1000/60, this);
        gameLoop.start();

        // Generador de cactus cada 1.5 segundos
        placeCactusTimer = new Timer(1500, e -> {
            if (!gameOver) spawnCactus();
        });
        placeCactusTimer.start();
    }

    void spawnCactus() {
        cacti.add(new Rectangle(cactusX, cactusY, cactusWidth, cactusHeight));
    }

    @Override
    public void paintComponent(Graphics g) {
        super.paintComponent(g);
        draw(g);
    }

    public void draw(Graphics g) {
        // Dibujar Dino
        g.setColor(Color.DARK_GRAY);
        g.fillRect(dinoX, dinoY, dinoWidth, dinoHeight);

        // Dibujar Cactus
        g.setColor(Color.RED);
        for (Rectangle cactus : cacti) {
            g.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
        }

        if (gameOver) {
            g.setColor(Color.BLACK);
            g.drawString("GAME OVER - Presiona Espacio para reiniciar", 250, 100);
        }
    }

    public void move() {
        // Física del salto
        velocityY += gravity;
        dinoY += velocityY;

        // Limitar el suelo
        if (dinoY > boardHeight - dinoHeight) {
            dinoY = boardHeight - dinoHeight;
            velocityY = 0;
        }

        // Movimiento de cactus y colisiones
        for (int i = 0; i < cacti.size(); i++) {
            Rectangle c = cacti.get(i);
            c.x -= 7; // Velocidad de desplazamiento

            // Algoritmo AABB (Detección de colisión)
            if (new Rectangle(dinoX, dinoY, dinoWidth, dinoHeight).intersects(c)) {
                gameOver = true;
            }
        }
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (!gameOver) {
            move();
            repaint();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_SPACE) {
            if (gameOver) {
                // Reiniciar juego
                dinoY = boardHeight - dinoHeight;
                cacti.clear();
                gameOver = false;
                velocityY = 0;
            } else if (dinoY == boardHeight - dinoHeight) {
                // Saltar solo si está en el suelo
                velocityY = -15;
            }
        }
    }

    // Métodos KeyListener no utilizados
    public void keyTyped(KeyEvent e) {}
    public void keyReleased(KeyEvent e) {}

    public static void main(String[] args) {
        JFrame frame = new JFrame("Java T-Rex Runner");
        DinoGame game = new DinoGame();
        frame.add(game);
        frame.pack();
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
    }
} DinoGame {
    
}

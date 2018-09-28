import java.awt.image.BufferedImage;
import java.awt.Graphics; 
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.io.*;
import javax.imageio.ImageIO;
public class ImageTransition extends JFrame {
    public BufferedImage image1;
    public BufferedImage image2;
    public BufferedImage image3;
    private int radius;
    private JFrame frame;
    public static void main(String[] args) {
        ImageTransition test=new ImageTransition();
    }

    public ImageTransition() {
        radius = 0;
        try {
            image1 = ImageIO.read(new File("../images/Nobel.jpg"));
            image2 = ImageIO.read(new File("../images/Lena.jpg"));
            image3 = new BufferedImage(image1.getWidth(), image1.getHeight(), BufferedImage.TYPE_INT_RGB);
        } catch (Exception e) {
            e.printStackTrace();
        }

        frame = new JFrame("Image Transition");
        this.setTitle("Image Transition");
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setSize((int)(image1.getWidth()*1.08),(int)(image1.getHeight()*1.2));

        JPanel panel = new ImagePanel();
        getContentPane().add(panel);
        this.setVisible(true);
        
        while(radius < image2.getHeight()/2*1.5) {
            radius++;
            for(int i=0;i<image1.getWidth();i++){
                for(int j=0;j<image1.getHeight();j++){
                    if((i-image1.getWidth()/2)*(i-image1.getWidth()/2) + (j-image1.getHeight()/2)*(j-image1.getHeight()/2) <= radius*radius) {
                        int pixel = image2.getRGB(i,j);
                        pixel &= 0xff0000; // 清除g,b
                        pixel |= pixel >> 16; 
                        pixel |= pixel >> 8; 
                        image3.setRGB(i, j, pixel);
                    } else {
                        int pixel = image1.getRGB(i,j);
                        pixel &= 0xff0000; // 清除g,b
                        pixel |= pixel >> 16; 
                        pixel |= pixel >> 8; 
                        image3.setRGB(i, j, pixel);
                    }
                }
            }
            repaint();
        }
    }

    class ImagePanel extends JPanel {
        public void paint(Graphics g) {
            super.paint(g);
            g.drawImage(image3, 0, 0, image3.getWidth(), image3.getHeight(), this);
        }
    }
}
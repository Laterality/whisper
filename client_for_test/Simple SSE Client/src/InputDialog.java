import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class InputDialog extends JDialog implements ActionListener{

	private final JTextField mFieldChannelId;
	private final JButton mBtnOk;
	private final OnOKListener mListener;

	public InputDialog(OnOKListener listener) {

		mListener = listener;

		mFieldChannelId = new JTextField();
		mBtnOk = new JButton("OK");

		mBtnOk.addActionListener(this);

		setLayout(new BorderLayout(5, 5));

		add(mFieldChannelId, BorderLayout.CENTER);
		add(mBtnOk, BorderLayout.EAST);

		setSize(200, 75);
		setVisible(true);
	}

	@Override
	public void actionPerformed(ActionEvent e) {

		if (e.getSource().equals(mBtnOk)) {
			mListener.OnOK(mFieldChannelId.getText());
			setVisible(false);
		}
	}

	public interface OnOKListener {
		public void OnOK(String input);
	}
}

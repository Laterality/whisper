import javax.swing.*;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

public class View implements ActionListener, KeyListener, IView, ListSelectionListener{
	
	private final IPresenter mPresenter;
	
	private final JFrame mFrame;
	private final JTextArea mTARecords;
	private final JList<String> mListMessages;
	private final JList<String> mListChannels;
	private final JTextField mFieldInput;
	private final JTextField mFieldUserId;
	private final JButton mBtnSend;
	private final JButton mBtnConnect;
	private final JButton mBtnRefreshChannels;
	private final JButton mBtnCreateChannel;
	private final JButton mBtnJoinChannel;
	private final JScrollPane mSpForTa;
	private final JScrollPane mSpForChannels;
	private final JPanel mPanelBottom;
	private final JPanel mPanelChannels;
	private final JPanel mPanelConnect;
	private final JPanel mPanelChannelsBottom;
	private final DefaultListModel<String> mMessageListModel;
	private final DefaultListModel<String> mListModel;


	
	public View(IPresenter presenter) {
		
		mPresenter = presenter;
		mPresenter.setView(this);
//		mPresenter.connect();
		
		mTARecords			= new JTextArea();
		mMessageListModel	= new DefaultListModel<>();
		mListMessages		= new JList<>(mMessageListModel);
		mFieldInput			= new JTextField();
		mBtnSend			= new JButton("Send");
		mPanelBottom		= new JPanel(new BorderLayout());
		mBtnJoinChannel		= new JButton("Join");
		
		mListMessages.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);

		mFieldInput.addKeyListener(this);
		mBtnSend.addActionListener(this);
		mBtnJoinChannel.addActionListener(this);
		
//		mSpForTa = new JScrollPane(mTARecords);
		mSpForTa = new JScrollPane(mListMessages);

		mPanelBottom.add(mFieldInput, BorderLayout.CENTER);
		mPanelBottom.add(mBtnSend, BorderLayout.EAST);

		mPanelChannels = new JPanel(new BorderLayout());

		mListModel = new DefaultListModel<>();
		mListChannels = new JList(mListModel);
		mBtnRefreshChannels = new JButton("Refresh");
		mBtnCreateChannel = new JButton("Create");
		mPanelChannelsBottom = new JPanel(new GridLayout(2,1));

		mListChannels.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
		mListChannels.addListSelectionListener(this);

		mPanelChannelsBottom.add(mBtnRefreshChannels);
		mPanelChannelsBottom.add(mBtnCreateChannel);

		mBtnRefreshChannels.addActionListener(this);
		mBtnCreateChannel.addActionListener(this);

		mSpForChannels = new JScrollPane(mListChannels);

		mPanelChannels.add(mListChannels, BorderLayout.CENTER);
//		mPanelChannels.add(mBtnRefreshChannels, BorderLayout.SOUTH);
		mPanelChannels.add(mPanelChannelsBottom, BorderLayout.SOUTH);

		mPanelConnect = new JPanel(new BorderLayout());

		mFieldUserId = new JTextField();
		mBtnConnect = new JButton("Connect");
		mBtnConnect.addActionListener(this);

		mPanelConnect.add(mFieldUserId, BorderLayout.CENTER);
		mPanelConnect.add(mBtnConnect, BorderLayout.EAST);
		
		mFrame = new JFrame("Simple SSE Client");
		mFrame.setSize(350, 500);
		mFrame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		mFrame.setLayout(new BorderLayout());
		mFrame.setVisible(true);
		
		mFrame.add(mPanelBottom, BorderLayout.SOUTH);
		mFrame.add(mSpForTa, BorderLayout.CENTER);
		mFrame.add(mPanelChannels, BorderLayout.EAST);
		mFrame.add(mPanelConnect, BorderLayout.NORTH);
		mFrame.addKeyListener(this);


//		mPresenter.onRefreshChannels();
	}


	@Override
	public void keyPressed(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public void keyTyped(KeyEvent e) {
		if (e.getKeyCode() == KeyEvent.VK_ENTER) {
			mPresenter.onSend();
		}
		
	}


	@Override
	public void actionPerformed(ActionEvent e) {
		if (e.getSource().equals(mBtnSend)) {
			mPresenter.onSend();
		}
		else if (e.getSource().equals(mBtnRefreshChannels)) {
			mPresenter.onRefreshChannels();
		}
		else if (e.getSource().equals(mBtnConnect)) {
			mPresenter.connect();
		}
		else if (e.getSource().equals(mBtnCreateChannel)) {
			new InputDialog((input) -> {
				mPresenter.onCreateChannel(input);
			});

		}
		else if (e.getSource().equals(mBtnJoinChannel)) {
			new InputDialog((input) -> {
				mPresenter.onJoinChannel(input);
			});
		}
		
	}


	@Override
	public void appendText(String s) {
//		mTARecords.append(s + "\r\n");
		mMessageListModel.addElement(s);
	}


	@Override
	public String getInput() {
		return mFieldInput.getText();
	}

	@Override
	public String getUserIdInput() {
		return mFieldUserId.getText();
	}

	@Override
	public void clearInput() {
		mFieldInput.setText("");
	}

	@Override
	public void clearChannels() {
		mListModel.removeAllElements();
	}

	@Override
	public void addChannel(String str) {
		mListModel.addElement(str);
	}

	@Override
	public void setUserIdFieldEnabled(boolean enabled) {
		mFieldUserId.setEnabled(enabled);
	}

	@Override
	public void setConnectButtonEnabled(boolean enabled) {
		mBtnConnect.setEnabled(enabled);
	}

	@Override
	public String getSelectedChannelId() {
		return mListModel.getElementAt(mListChannels.getSelectedIndex());
	}

	@Override
	public void clearMessages() {
		mMessageListModel.removeAllElements();
	}

	@Override
	public void valueChanged(ListSelectionEvent e) {
		mPresenter.onChangeChannel(mListModel.getElementAt(mListChannels.getSelectedIndex()));
	}
}

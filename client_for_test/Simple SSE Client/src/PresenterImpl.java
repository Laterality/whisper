import java.util.Date;

public class PresenterImpl implements IPresenter {

	private final Model mModel;
	private IView mView;
	private boolean mConnected;

	public PresenterImpl() {
		mModel = new Model();
		mConnected = false;
	}

	@Override
	public void setView(IView v) {
		mView = v;

	}

	@Override
	public void connect() {
		String userId = mView.getUserIdInput();
		mModel.connect(userId, (msg) -> {
			mView.appendText(String.format("%s: %s", msg.from, msg.msg));
		}, () -> {
			mView.setConnectButtonEnabled(false);
			mView.setUserIdFieldEnabled(false);
			mConnected = true;
			onJoinChannel("default");
			onRefreshChannels();
		});
	}

	@Override
	public void onSend() {
		if (!mConnected) { return; }
		String input = mView.getInput();
		if (input.matches("^\\/")) {
			String[] args = input.split("/")[0].split(" ");
			if (args[0].equals("chadd")) {
				// add channel

			}

		}
		else {
			mModel.send(
					new Message(
							mView.getUserIdInput(),
							"default",
							input,
							new Date()
					));
		}
		mView.clearInput();
	}

	@Override
	public void onRefreshChannels() {
		mView.clearChannels();
		String[] channels = mModel.refreshChannels();
		if (channels != null) {
			for (String c : channels) {
				mView.addChannel(c);
			}
		}

	}

	@Override
	public void onCreateChannel(String channelId) {
		mModel.createChannel(channelId);
		onRefreshChannels();
	}

	@Override
	public void onChangeChannel(String channelId) {
		mView.clearMessages();
		Message[] messages = mModel.getMessages(channelId);
		
		if (messages != null) {
			for (Message m : messages) {
				mView.appendText(String.format("%s: %s", m.from, m.msg));
			}
		}
	}

	@Override
	public void onJoinChannel(String channelId) {
		mModel.joinChannel(channelId);
		onRefreshChannels();
	}

}

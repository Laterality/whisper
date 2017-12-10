
public interface IView {

	public void appendText(String s);
	public String getInput();
	public String getUserIdInput();
	public void clearInput();
	public void clearChannels();
	public void addChannel(String str);
	public void setUserIdFieldEnabled(boolean enabled);
	public void setConnectButtonEnabled(boolean enabled);
	public String getSelectedChannelId();
	public void clearMessages();
}

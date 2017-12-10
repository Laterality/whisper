
public interface IPresenter {
	
	public void setView(IView v);
	public void connect();
	public void onSend();
	public void onRefreshChannels();
	public void onCreateChannel(String channelId);
	public void onChangeChannel(String channelId);
}

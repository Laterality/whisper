import java.util.Date;

public class Message {
	public final String from;
	public final String to;
	public final String msg;
	public final Date dateSent;

	public Message(final String from, final String to, final String msg, final Date dateSent) {
		this.from = from;
		this.to = to;
		this.msg = msg;
		this.dateSent = dateSent;
	}
}

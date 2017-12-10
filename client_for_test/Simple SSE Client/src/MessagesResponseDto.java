import java.util.Date;

public class MessagesResponseDto extends BasicResponseDto{

	public final Message[] messages;


	public MessagesResponseDto(String result, String message, Message[] messages) {
		super(result, message);
		this.messages = messages;
	}
}

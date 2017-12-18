import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

import org.glassfish.jersey.media.sse.EventInput;
import org.glassfish.jersey.media.sse.InboundEvent;
import org.glassfish.jersey.media.sse.SseFeature;

import com.google.gson.Gson;

import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

public class Model {

	private static final String BASE_URL = "http://localhost:3004";

	private Client mClient;
	private final Gson mGson;
	private Service mService;
	private String userId;


	public Model() {
		mGson = new Gson();

		try {
			Retrofit retrofit = new Retrofit.Builder()
					.baseUrl(BASE_URL)
					.addConverterFactory(GsonConverterFactory.create())
					.build();

			mService = retrofit.create(Service.class);
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void connect(String userId, OnMessageReceivedListener listener, OnConnectedListener connectedListener) {
		this.userId = userId;
		new Thread(() -> {
			mClient = ClientBuilder.newBuilder()

					.register(SseFeature.class).build();

			WebTarget target = mClient.target(BASE_URL + "/connect?userId=" + userId);

			EventInput eventInput = null;
			while (true) {
				
				if (eventInput == null) {
					eventInput = target.request().get(EventInput.class);
				}
				
				final InboundEvent inboundEvent = eventInput.read();
				if (inboundEvent == null) {
					break;
				}

//				System.out.println(inboundEvent.getName() + "; " +
//						inboundEvent.readData(String.class));
				if (listener != null) {
					String msg = inboundEvent.readData(String.class);
					if (msg.equals("connected")) {
						if (connectedListener != null) {
							connectedListener.onConnected();
						}
					}
					else {
						listener.onReceived(mGson.fromJson(msg, Message.class));
					}
				}
				try {
					Thread.sleep(1);
				}
				catch (Exception e) {
					break;
				}
			}
		}).start();
	}

	public void send(Message msg) {
		try {
			Retrofit retrofit = new Retrofit.Builder()
					.baseUrl(BASE_URL)
					.addConverterFactory(GsonConverterFactory.create())
					.build();

			Service s = retrofit.create(Service.class);

			Call<BasicResponseDto> call = s.sendMessage(msg);

			Response<BasicResponseDto> res = call.execute();

			if (res.isSuccessful()) {
				System.out.println("result: " + res.body().result);
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public String[] refreshChannels() {
		try {
			Call<ChannelsResponseDto> call = mService.retrieveChannelsUserBelong(userId);

			Response<ChannelsResponseDto> res = call.execute();

			if (res.isSuccessful()) {
				return res.body().channels;
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}

		return null;
	}

	public boolean createChannel(String channelId) {
		try {

			Call<BasicResponseDto> call = mService.createChannel(channelId, userId);

			Response<BasicResponseDto> res = call.execute();

			return res.isSuccessful();

		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	public Message[] getMessages(String channelId) {

		try {
			Call<MessagesResponseDto> call = mService.retrieveMessages(channelId);
			Response<MessagesResponseDto> res = call.execute();

			if (res.body().result.equals("OK")) {
				return res.body().messages;
			}
			else {
				return null;
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	
	public void joinChannel(String channelId) {
		try {
			JoinChannelRequestDto jcr = new JoinChannelRequestDto();
			jcr.userId = this.userId;
			jcr.channelId = channelId;
			Call<BasicResponseDto> call = mService.joinChannel(jcr);
			
			Response<BasicResponseDto> res = call.execute();
			
			if (res.isSuccessful() && res.body().message.equals("OK")) {
				System.out.println("Joined to " + channelId); 
			}
		}
		catch (Exception e) {
			e.printStackTrace();
		}
	}

	public interface OnMessageReceivedListener {
		public void onReceived(Message msg);
	}
	
	public interface OnConnectedListener {
		public void onConnected();
	}

	public interface Service {

		@GET("/channels")
		public Call<ChannelsResponseDto> getChannelList();

		@POST("/send")
		public Call<BasicResponseDto> sendMessage(@Body Message msg);

		@POST("/channel/create")
		public Call<BasicResponseDto> createChannel(@Query("channelId") String channelId, @Query("owner") String owner);

		@GET("channel/{channelId}/messages")
		public Call<MessagesResponseDto> retrieveMessages(@Path("channelId") String channelId);
		
		@GET("user/{userId}/channels")
		public Call<ChannelsResponseDto> retrieveChannelsUserBelong(@Path("userId") String userId);
		
		@POST("channel/join")
		public Call<BasicResponseDto> joinChannel(@Body JoinChannelRequestDto dto);
	}
}

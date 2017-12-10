import com.google.gson.Gson;
import org.glassfish.jersey.media.sse.EventInput;
import org.glassfish.jersey.media.sse.InboundEvent;
import org.glassfish.jersey.media.sse.SseFeature;
import retrofit2.Call;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import javax.ws.rs.client.WebTarget;

public class Model {

	private static final String BASE_URL = "http://localhost:3004";

	private Client mClient;
	private final Gson mGson;
	private Service mService;


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

	public void connect(String userId, OnMessageReceivedListener listener) {
		new Thread(() -> {
			mClient = ClientBuilder.newBuilder()

					.register(SseFeature.class).build();

			WebTarget target = mClient.target(BASE_URL + "/connect?userId=" + userId);

			EventInput eventInput = target.request().get(EventInput.class);

			while (!eventInput.isClosed()) {
				final InboundEvent inboundEvent = eventInput.read();
				if (inboundEvent == null) {
					break;
				}

//				System.out.println(inboundEvent.getName() + "; " +
//						inboundEvent.readData(String.class));
					if (listener != null) {
					String msg = inboundEvent.readData(String.class);
					listener.onReceived(mGson.fromJson(msg, Message.class));
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
			Call<ChannelsResponseDto> call = mService.getChannelList();

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

			Call<BasicResponseDto> call = mService.createChannel(channelId);

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

	public interface OnMessageReceivedListener {
		public void onReceived(Message msg);
	}

	public interface Service {

		@GET("/channels")
		public Call<ChannelsResponseDto> getChannelList();

		@POST("/send")
		public Call<BasicResponseDto> sendMessage(@Body Message msg);

		@POST("/channel/create")
		public Call<BasicResponseDto> createChannel(@Body String channelId);

		@GET("channel/{channelId}/messages")
		public Call<MessagesResponseDto> retrieveMessages(@Path("channelId") String channelId);
	}
}

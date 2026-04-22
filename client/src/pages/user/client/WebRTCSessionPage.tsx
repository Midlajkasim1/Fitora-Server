import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { VIDEO_ROUTES } from "../../../constants/api.constants";
import { useAuthStore } from "../../../store/use-auth-store";
import { 
    LiveKitRoom, 
    RoomAudioRenderer,
    ControlBar,
    GridLayout,
    ParticipantTile,
    useTracks,
    useRemoteParticipants,
    VideoTrack,
} from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";
import { XOctagon, Loader2, ShieldCheck, Activity, Users, UserCheck, Video, Layout, Maximize2, Minimize2 } from "lucide-react";
import toast from "react-hot-toast";

const WebRTCSessionPage = () => {
    const { id: slotId } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    
    const [token, setToken] = useState<string | null>(null);
    const [host, setHost] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await api.get(VIDEO_ROUTES.GET_TOKEN(slotId!));
                setToken(response.data.data.token);

                let serverUrl = response.data.data.host;
                if (serverUrl && !serverUrl.startsWith("ws")) {
                    serverUrl = serverUrl.replace(/^http/, 'ws');
                    if (!serverUrl.startsWith("ws")) serverUrl = `wss://${serverUrl}`;
                }
                setHost(serverUrl);
            } catch (error: any) {
                const msg = error.response?.data?.message || "Failed to join session";
                toast.error(msg);
                user?.role === "trainer" ? navigate("/trainer/session") : navigate("/upcoming-sessions");
            } finally {
                setIsLoading(false);
            }
        };

        if (slotId) fetchToken();
    }, [slotId, navigate, user]);

    const handleEndSession = async () => {
        if (!window.confirm("Are you sure you want to end this session for everyone?")) return;
        
        try {
            await api.post(VIDEO_ROUTES.END_SESSION(slotId!));
            toast.success("Session concluded.");
            navigate("/trainer/session");
        } catch (error: any) {
            toast.error("Failed to end session officially");
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen bg-[#06110d] flex flex-col items-center justify-center space-y-6">
                <div className="relative">
                    <Loader2 className="w-16 h-16 text-[#00ff94] animate-spin" />
                    <Activity className="absolute inset-0 m-auto w-6 h-6 text-[#00ff94] animate-pulse" />
                </div>
                <p className="text-white font-black uppercase italic tracking-widest text-xs animate-pulse tracking-[0.2em]">Syncing Media Tunnel</p>
            </div>
        );
    }

    if (!token || !host) return null;

    return (
        <div className="h-screen bg-[#040a08] flex flex-col overflow-hidden text-white font-sans lk-theme-dark">
            <LiveKitRoom
                video={true}
                audio={true}
                token={token}
                serverUrl={host}
                connect={true}
                onDisconnected={() => {
                    user?.role === "trainer" ? navigate("/trainer/session") : navigate(`/session-review/${slotId}`);
                }}

                className="flex-1 flex flex-col"
            >
                {/* Header */}
                <header className="px-6 py-4 bg-[#0d1a16] border-b border-white/5 flex items-center justify-between z-40">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-[#00ff94]/10 border border-[#00ff94]/20 rounded-full">
                            <ShieldCheck size={12} className="text-[#00ff94]" />
                            <span className="text-[9px] font-black uppercase italic tracking-widest text-[#00ff94]">Fitora Elite Stream</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {user?.role === "trainer" && (
                            <button 
                                onClick={handleEndSession}
                                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-all font-black uppercase italic text-[10px] shadow-lg shadow-red-900/40 border border-white/10"
                            >
                                <XOctagon size={14} className="inline mr-2" /> End Workshop
                            </button>
                        )}
                    </div>
                </header>

                <main className="flex-1 relative bg-black flex overflow-hidden h-full">
                     <SmartVideoLayout role={user?.role} />
                </main>

                <footer className="h-24 bg-[#0d1a16] border-t border-white/5 flex items-center justify-center z-40">
                    <div className="bg-black/60 px-8 py-2.5 rounded-full border border-white/10 backdrop-blur-2xl shadow-2xl flex items-center gap-6">
                        <ControlBar variation="minimal" controls={{ chat: false }} />
                    </div>
                </footer>

                <RoomAudioRenderer />
            </LiveKitRoom>
        </div>
    );
};

const SmartVideoLayout = ({ role }: { role?: string }) => {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, name: 'camera' },
      { source: Track.Source.ScreenShare, name: 'screen_share' },
    ],
    { onlyConsiderOnStage: false },
  );

  const remoteParticipants = useRemoteParticipants();
  const [pinnedTrack, setPinnedTrack] = useState<TrackReference | null>(null);

  // Identify Trainer
  const trainerTrack = useMemo(() => {
    const found = tracks.find(t => {
        try {
            const meta = JSON.parse(t.participant.metadata || '{}');
            return meta.role === 'trainer';
        } catch(e) { return false; }
    });
    return found as TrackReference | undefined;
  }, [tracks]);

  // All student tracks
  const studentTracks = useMemo(() => {
    const filtered = tracks.filter(t => {
        try {
            const meta = JSON.parse(t.participant.metadata || '{}');
            return meta.role !== 'trainer';
        } catch(e) { return true; }
    });
    return filtered as TrackReference[];
  }, [tracks]);

  // Logic: Big Screen is the pinned student or default to Trainer
  const mainStageTrack = pinnedTrack || trainerTrack;

  // --- TRAINER COMMAND CENTER (Google Meet Style) ---
  if (role === 'trainer') {
    return (
        <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden bg-[#040a08]">
            {/* Main Monitoring Stage */}
            <div className="flex-[4] relative bg-black border-r border-white/5 h-full flex items-center justify-center overflow-hidden">
                <div className="absolute top-6 left-8 z-20 flex items-center gap-3">
                     <Layout size={16} className="text-[#00ff94]" />
                     <h2 className="text-[10px] font-black uppercase italic tracking-[0.2em] text-white/50">
                        {pinnedTrack ? 'Analyzing Student Form' : 'Lead Instructor Mirror'}
                     </h2>
                </div>

                {mainStageTrack ? (
                    <>
                        <VideoTrack trackRef={mainStageTrack} className="w-full h-full object-contain" />
                        
                        {/* Status Pin Overlay */}
                        <div className="absolute bottom-10 right-10 flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl z-20">
                             <div className={`w-2 h-2 rounded-full ${pinnedTrack ? 'bg-orange-500' : 'bg-[#00ff94]'} animate-pulse`} />
                             <span className="text-[9px] font-black uppercase italic tracking-widest">
                                {pinnedTrack ? 'Student Highlighted' : 'Coach Primary'}
                             </span>
                             {pinnedTrack && (
                                 <button 
                                    onClick={() => setPinnedTrack(null)}
                                    className="ml-2 p-1 hover:bg-white/10 rounded-md transition-colors"
                                 >
                                    <Minimize2 size={12} className="text-white/40" />
                                 </button>
                             )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-6 opacity-20">
                         <Loader2 className="w-12 h-12 text-[#00ff94] animate-spin" strokeWidth={1} />
                         <p className="text-[10px] font-black uppercase italic tracking-[0.4em]">Establishing Secure Relay...</p>
                    </div>
                )}
            </div>

            {/* Tactical Participant Sidebar */}
            <aside className="flex-1 min-w-[340px] bg-[#0d1a16] flex flex-col border-l border-white/5 overflow-hidden">
                 <div className="p-6 border-b border-white/5 bg-[#12241f]/40">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-[10px] font-black uppercase italic text-[#00ff94] tracking-widest flex items-center gap-2">
                            <Users size={14} strokeWidth={3} /> Grid Roster
                        </h2>
                        <span className="text-[9px] font-bold text-white/30 uppercase">{remoteParticipants.length} Connected</span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
                     {/* If Trainer is NOT on main stage, show them here */}
                     {trainerTrack && trainerTrack !== mainStageTrack && (
                         <div 
                            onClick={() => setPinnedTrack(null)}
                            className="aspect-video w-full rounded-2xl overflow-hidden border-2 border-[#00ff94]/40 bg-black cursor-pointer hover:scale-[1.02] transition-transform relative"
                         >
                            <VideoTrack trackRef={trainerTrack} className="w-full h-full object-cover" />
                            <div className="absolute top-3 right-3 bg-[#00ff94] p-1 rounded-md">
                                <Maximize2 size={10} className="text-black" />
                            </div>
                         </div>
                     )}

                     {studentTracks.map((track, i) => (
                        <div 
                            key={i} 
                            onClick={() => setPinnedTrack(track)}
                            className={`aspect-video w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-[1.02] relative
                                ${pinnedTrack === track ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-black/40'}
                            `}
                        >
                             <ParticipantTile trackRef={track} />
                             <div className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                <Maximize2 size={10} className="text-white" />
                             </div>
                             <div className="absolute bottom-3 left-4 flex items-center gap-2">
                                 <div className="w-1 h-1 bg-white/40 rounded-full" />
                                 <span className="text-[8px] font-black uppercase text-white/60 tracking-wider">
                                    {track.participant.identity}
                                 </span>
                             </div>
                        </div>
                     ))}

                     {studentTracks.length === 0 && !pinnedTrack && (
                         <div className="flex-1 flex flex-col items-center justify-center opacity-10 gap-6 mt-32">
                             <UserCheck size={48} strokeWidth={1} />
                             <span className="text-[10px] font-black uppercase italic text-center tracking-[0.3em]">No Students Joined</span>
                         </div>
                     )}
                 </div>
            </aside>
        </div>
    );
  }

  // --- CLIENT VIEW ---
  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden bg-black">
        <div className="flex-[5] relative bg-black border-r border-white/5 h-full flex items-center justify-center overflow-hidden">
             {trainerTrack ? (
                 <>
                    <VideoTrack trackRef={trainerTrack} className="w-full h-full object-contain" />
                    <div className="absolute bottom-10 left-10 flex items-center gap-4 px-5 py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl z-20 shadow-2xl">
                         <div className="w-2.5 h-2.5 bg-[#00ff94] rounded-full animate-pulse shadow-[0_0_15px_#00ff94]" />
                         <div className="flex flex-col gap-0.5">
                             <span className="text-[10px] font-black uppercase italic tracking-widest text-[#00ff94]">Coach Spotlight</span>
                             <span className="text-[8px] font-bold text-white/40 uppercase">Broadcasting Now</span>
                         </div>
                    </div>
                 </>
             ) : (
                <div className="flex flex-col items-center gap-8 opacity-40">
                     <Loader2 className="w-16 h-16 text-[#00ff94] animate-spin" strokeWidth={1} />
                     <p className="text-[10px] font-black uppercase italic tracking-[0.6em] text-white">Establishing Secure Bridge</p>
                </div>
             )}
        </div>

        <aside className="flex-1 min-w-[360px] bg-[#0d1a16] flex flex-col border-l border-white/5 overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 bg-[#12241f]/40 backdrop-blur-md">
                <h2 className="text-[11px] font-black uppercase italic text-[#00ff94] tracking-widest flex items-center gap-2">
                    <Users size={14} strokeWidth={3} /> Class Dashboard
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar bg-gradient-to-b from-transparent to-[#040a08]/50">
                {studentTracks.map((track, i) => (
                    <div key={i} className="aspect-video w-full rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 group relative shadow-xl hover:border-[#00ff94]/30 transition-all duration-300">
                         <ParticipantTile trackRef={track} />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                             <span className="text-[9px] font-black uppercase italic text-white/70 tracking-tighter">
                                {track.participant.identity}
                             </span>
                         </div>
                    </div>
                ))}
            </div>
        </aside>
    </div>
  );
};

export default WebRTCSessionPage;

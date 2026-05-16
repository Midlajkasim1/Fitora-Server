import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { VIDEO_ROUTES, TRAINER_VIDEO_ROUTES } from "../../../constants/api.constants";
import { useAuthStore } from "../../../store/use-auth-store";
import { 
    LiveKitRoom, 
    RoomAudioRenderer,
    ControlBar,
    ParticipantTile,
    useTracks,
    useRemoteParticipants,
    VideoTrack,
} from "@livekit/components-react";
import type { TrackReference } from "@livekit/components-react";
import { Track } from "livekit-client";
import { XOctagon, Loader2, ShieldCheck, Activity, Users, UserCheck, Video, Layout, Maximize2, Minimize2 } from "lucide-react";
import toast from "react-hot-toast";
import { ConfirmModal } from "../../../shared/ConfirmModal";

const WebRTCSessionPage = () => {
    const { id: slotId } = useParams();
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    
    const [token, setToken] = useState<string | null>(null);
    const [host, setHost] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEndModalOpen, setIsEndModalOpen] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current || !slotId) return;
        hasFetched.current = true;
        
        const fetchToken = async () => {
            try {
                const routes = user?.role === 'trainer' ? TRAINER_VIDEO_ROUTES : VIDEO_ROUTES;
                const response = await api.get(routes.GET_TOKEN(slotId!));
                setToken(response.data.data.token);

                let serverUrl = response.data.data.host;
                if (serverUrl && !serverUrl.startsWith("ws")) {
                    serverUrl = serverUrl.replace(/^http/, 'ws');
                    if (!serverUrl.startsWith("ws")) serverUrl = `wss://${serverUrl}`;
                }
                setHost(serverUrl);
            } catch {
                if (user?.role === "trainer") navigate("/trainer/session"); else navigate("/upcoming-sessions");
            } finally {
                setIsLoading(false);
            }
        };

        if (slotId) fetchToken();
    }, [slotId, navigate, user]);

    const handleEndSession = async () => {
        try {
            await api.post(TRAINER_VIDEO_ROUTES.END_SESSION(slotId!));
            toast.success("Session concluded.");
            navigate("/trainer/session");
        } catch {
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
                    if (user?.role === "trainer") navigate("/trainer/session"); else navigate(`/session-review/${slotId}`);
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
                                onClick={() => setIsEndModalOpen(true)}
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
                        <ControlBar variation="minimal" controls={{ chat: false, leave: user?.role !== 'trainer' }} />
                        {user?.role === "trainer" && (
                             <button 
                                onClick={() => setIsEndModalOpen(true)}
                                className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full transition-all border border-red-500/20 group relative"
                                title="End Workshop for All"
                             >
                                <XOctagon size={20} strokeWidth={2.5} />
                                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black text-white text-[8px] font-black uppercase italic rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                    End Session
                                </span>
                             </button>
                        )}
                    </div>
                </footer>

                <RoomAudioRenderer />
            </LiveKitRoom>

            <ConfirmModal 
                isOpen={isEndModalOpen}
                onClose={() => setIsEndModalOpen(false)}
                onConfirm={handleEndSession}
                title="End Workshop?"
                message="Are you sure you want to end this session for everyone? This action cannot be undone."
                confirmText="Yes, End Session"
                variant="danger"
            />
        </div>
    );
};

const isTrainer = (participant: { metadata?: string }) => {
    try {
        const meta = JSON.parse(participant.metadata || '{}');
        return meta.role === 'trainer';
    } catch {
        return false;
    }
};

const SmartVideoLayout = ({ role }: { role?: string }) => {
  const tracks = useTracks(
    [
      Track.Source.Camera,
    ]
  );

  const remoteParticipants = useRemoteParticipants();
  const [pinnedTrack, setPinnedTrack] = useState<TrackReference | null>(null);

  // Identify Trainer Track
  const trainerTrack = useMemo(() => {
    return tracks.find(t => isTrainer(t.participant)) as TrackReference | undefined;
  }, [tracks]);

  // All student tracks (excluding trainer and potentially local)
  const studentTracks = useMemo(() => {
    return tracks.filter(t => !isTrainer(t.participant)) as TrackReference[];
  }, [tracks]);

  // Logic: Big Screen is the pinned student or default to Trainer
  const mainStageTrack = pinnedTrack || trainerTrack;

  // --- TRAINER COMMAND CENTER (Google Meet Style) ---
  if (role === 'trainer') {
    return (
        <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden bg-[#040a08]">
            {/* Main Monitoring Stage */}
            <div className="flex-[3] lg:flex-[4] relative bg-black border-b lg:border-r lg:border-b-0 border-white/5 h-[50vh] lg:h-full flex items-center justify-center overflow-hidden">
                <div className="absolute top-4 lg:top-6 left-4 lg:left-8 z-20 flex items-center gap-2 lg:gap-3">
                     <Layout size={14} className="text-[#00ff94]" />
                     <h2 className="text-[8px] lg:text-[10px] font-black uppercase italic tracking-[0.2em] text-white/50">
                        {pinnedTrack ? 'Analyzing Student Form' : 'Lead Instructor Mirror'}
                     </h2>
                </div>

                {mainStageTrack ? (
                    <>
                        <VideoTrack 
                            trackRef={mainStageTrack} 
                            className="w-full h-full object-contain" 
                        />
                        
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
            <aside className="flex-1 w-full lg:min-w-[340px] bg-[#0d1a16] flex flex-col border-t lg:border-l lg:border-t-0 border-white/5 overflow-hidden">
                 <div className="p-4 lg:p-6 border-b border-white/5 bg-[#12241f]/40">
                    <div className="flex items-center justify-between mb-1 lg:mb-2">
                        <h2 className="text-[9px] lg:text-[10px] font-black uppercase italic text-[#00ff94] tracking-widest flex items-center gap-2">
                            <Users size={12} strokeWidth={3} /> Grid Roster
                        </h2>
                        <span className="text-[8px] lg:text-[9px] font-bold text-white/30 uppercase">{remoteParticipants.length} Connected</span>
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto lg:overflow-y-auto overflow-x-auto p-4 flex flex-row lg:flex-col gap-4 custom-scrollbar">
                     {trainerTrack && trainerTrack !== mainStageTrack && (
                         <div 
                            onClick={() => setPinnedTrack(null)}
                            className="aspect-video w-[200px] lg:w-full rounded-2xl overflow-hidden border-2 border-[#00ff94]/40 bg-black cursor-pointer hover:scale-[1.02] transition-transform relative shrink-0"
                         >
                            <VideoTrack 
                                trackRef={trainerTrack} 
                                className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-3 right-3 bg-[#00ff94] p-1 rounded-md">
                                <Maximize2 size={10} className="text-black" />
                            </div>
                            <span className="absolute bottom-3 left-3 text-[8px] font-black uppercase italic bg-black/60 px-2 py-1 rounded text-white/70">Mirror (You)</span>
                         </div>
                     )}

                     {remoteParticipants.filter(p => !isTrainer(p)).map((participant) => {
                        const cameraTrack = tracks.find(t => t.participant.identity === participant.identity && t.source === Track.Source.Camera);
                        return (
                            <div 
                                key={participant.identity} 
                                onClick={() => cameraTrack && setPinnedTrack(cameraTrack)}
                                className={`aspect-video w-[200px] lg:w-full rounded-2xl overflow-hidden border-2 transition-all cursor-pointer hover:scale-[1.02] relative shrink-0
                                    ${pinnedTrack?.participant.identity === participant.identity ? 'border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.3)]' : 'border-white/5 bg-black/40'}
                                `}
                            >
                                 {cameraTrack ? (
                                     <VideoTrack 
                                        trackRef={cameraTrack} 
                                        className="w-full h-full object-cover"
                                     />
                                 ) : (
                                     <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30">
                                         <Video size={24} />
                                         <span className="text-[8px] font-black uppercase italic">Camera Off</span>
                                     </div>
                                 )}
                                 <div className="absolute top-3 right-3 bg-black/60 p-1.5 rounded-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={10} className="text-white" />
                                 </div>
                                 <div className="absolute bottom-3 left-3 flex items-center gap-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/5">
                                     <div className="w-1 h-1 bg-[#00ff94] rounded-full animate-pulse" />
                                     <span className="text-[8px] font-black uppercase italic tracking-widest text-white/80">{participant.name || 'Student'}</span>
                                 </div>
                            </div>
                        );
                     })}

                     {remoteParticipants.filter(p => !isTrainer(p)).length === 0 && (
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
  const trainerParticipant = remoteParticipants.find(p => isTrainer(p));

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full h-full overflow-hidden bg-black">
        <div className="flex-[3] lg:flex-[5] relative bg-black border-b lg:border-r lg:border-b-0 border-white/5 h-[50vh] lg:h-full flex items-center justify-center overflow-hidden">
             {trainerTrack ? (
                 <>
                    <VideoTrack 
                        trackRef={trainerTrack} 
                        className="w-full h-full object-contain" 
                    />
                    <div className="absolute bottom-6 lg:bottom-10 left-6 lg:left-10 flex items-center gap-3 lg:gap-4 px-4 lg:px-5 py-2 lg:py-2.5 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl z-20 shadow-2xl">
                         <div className="w-2 lg:w-2.5 h-2 lg:h-2.5 bg-[#00ff94] rounded-full animate-pulse shadow-[0_0_15px_#00ff94]" />
                         <div className="flex flex-col gap-0.5">
                             <span className="text-[8px] lg:text-[10px] font-black uppercase italic tracking-widest text-[#00ff94]">Coach Spotlight</span>
                             <span className="text-[7px] lg:text-[8px] font-bold text-white/40 uppercase">Broadcasting Now</span>
                         </div>
                    </div>
                 </>
             ) : trainerParticipant ? (
                <div className="flex flex-col items-center gap-4 lg:gap-6 text-center">
                    <div className="w-16 h-16 lg:w-24 lg:h-24 rounded-full bg-[#00ff94]/10 border-2 border-[#00ff94]/20 flex items-center justify-center">
                        <Video size={24} className="lg:w-10 lg:h-10 text-[#00ff94]/40" />
                    </div>
                    <div className="space-y-1 lg:space-y-2">
                        <p className="text-white font-black uppercase italic tracking-widest text-[10px] lg:text-sm">Coach {trainerParticipant.name || 'Trainer'} is Here</p>
                        <p className="text-[#00ff94] text-[8px] lg:text-[10px] font-bold uppercase italic tracking-widest animate-pulse">Waiting for Video...</p>
                    </div>
                </div>
             ) : (
                <div className="flex flex-col items-center gap-6 lg:gap-8 opacity-40">
                     <Loader2 className="w-12 h-12 lg:w-16 lg:h-16 text-[#00ff94] animate-spin" strokeWidth={1} />
                     <p className="text-[8px] lg:text-[10px] font-black uppercase italic tracking-[0.6em] text-white">Establishing Secure Bridge</p>
                </div>
             )}
        </div>

        <aside className="flex-1 w-full lg:min-w-[360px] bg-[#0d1a16] flex flex-col border-t lg:border-l lg:border-t-0 border-white/5 overflow-hidden shadow-2xl">
            <div className="p-4 lg:p-8 border-b border-white/5 bg-[#12241f]/40 backdrop-blur-md">
                <h2 className="text-[10px] lg:text-[11px] font-black uppercase italic text-[#00ff94] tracking-widest flex items-center gap-2">
                    <Users size={12} strokeWidth={3} /> Class Dashboard
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto lg:overflow-y-auto overflow-x-auto p-4 lg:p-6 flex flex-row lg:flex-col gap-4 lg:gap-6 custom-scrollbar bg-gradient-to-b from-transparent to-[#040a08]/50">
                {studentTracks.map((track, i) => (
                    <div key={i} className="aspect-video w-[200px] lg:w-full rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden border border-white/5 bg-black/40 group relative shadow-xl hover:border-[#00ff94]/30 transition-all duration-300 shrink-0">
                         <ParticipantTile 
                            trackRef={track} 
                         />
                         <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                         </div>
                    </div>
                ))}
            </div>
        </aside>
    </div>
  );
};

export default WebRTCSessionPage;

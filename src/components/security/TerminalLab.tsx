import { useState, useRef, useEffect } from 'react';
import { Terminal, Shield, Play, RotateCcw, AlertCircle } from 'lucide-react';
import { Card, Button } from '../ui';

interface TerminalLine {
  text: string;
  type: 'input' | 'output' | 'error' | 'success' | 'system';
}

export function TerminalLab() {
  const [history, setHistory] = useState<TerminalLine[]>([
    { text: 'BLACK CYPHER SECURE SANDBOX TERMINAL v1.4.2-STABLE', type: 'system' },
    { text: 'Initializing virtualized guest container environment...', type: 'system' },
    { text: 'Type "help" to list available commands and start your mission.', type: 'system' },
    { text: '', type: 'output' }
  ]);
  const [input, setInput] = useState('');
  const [isRemoteSession, setIsRemoteSession] = useState(false);
  const [remoteUser, setRemoteUser] = useState('');
  const [sshStep, setSshStep] = useState<'none' | 'password'>('none');
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = input.trim();
    if (!command) return;

    // Add command to history
    const promptPrefix = isRemoteSession 
      ? `admin@secureserver.local:~$ ` 
      : `guest@blackcypher-sandbox:~$ `;
    
    setHistory(prev => [...prev, { text: `${promptPrefix}${command}`, type: 'input' }]);
    setInput('');

    // Handle SSH Password State separately
    if (sshStep === 'password') {
      if (command === 'elitepass123') {
        setIsRemoteSession(true);
        setSshStep('none');
        setHistory(prev => [
          ...prev,
          { text: 'Authentication successful! Session opened on remote node.', type: 'success' },
          { text: 'Welcome to SecureServer UNIX container system.', type: 'output' },
          { text: 'Try "ls" to browse directories.', type: 'output' }
        ]);
      } else {
        setSshStep('none');
        setHistory(prev => [
          ...prev,
          { text: 'Permission denied, please try again.', type: 'error' },
          { text: 'SSH connection to admin@secureserver.local closed.', type: 'system' }
        ]);
      }
      return;
    }

    const args = command.split(' ');
    const baseCommand = args[0].toLowerCase();

    // 1. LOCAL SANDBOX COMMANDS
    if (!isRemoteSession) {
      switch (baseCommand) {
        case 'help':
          setHistory(prev => [
            ...prev,
            { text: 'Available commands:', type: 'system' },
            { text: '  help                        Display this information panel.', type: 'output' },
            { text: '  clear                       Flush terminal screen buffer.', type: 'output' },
            { text: '  ls                          List local workspace directories and configurations.', type: 'output' },
            { text: '  cat <file>                  Print contents of target text file.', type: 'output' },
            { text: '  nmap -sV <target>           Scan specific remote node for open ports & services.', type: 'output' },
            { text: '  ssh admin@<target>          Initiate secure connection sequence to target host.', type: 'output' }
          ]);
          break;

        case 'clear':
          setHistory([]);
          break;

        case 'ls':
          setHistory(prev => [
            ...prev,
            { text: 'notes.txt      exploit.sh      shadow.bak', type: 'output' }
          ]);
          break;

        case 'cat':
          if (!args[1]) {
            setHistory(prev => [...prev, { text: 'Usage: cat <filename>', type: 'error' }]);
          } else if (args[1].toLowerCase() === 'notes.txt') {
            setHistory(prev => [
              ...prev,
              { text: '=== OPERATION BRIEFING ===', type: 'system' },
              { text: 'Target node is running locally at hostname: "secureserver.local"', type: 'output' },
              { text: 'Scan target with Nmap first to identify open entry ports.', type: 'output' },
              { text: 'Rumors say port 22 (SSH) is active under default username "admin".', type: 'output' },
              { text: 'Default root operator credential: "elitepass123"', type: 'output' },
              { text: 'Use this credential to ssh in and find the secret CTF flag!', type: 'output' }
            ]);
          } else if (args[1].toLowerCase() === 'exploit.sh' || args[1].toLowerCase() === 'shadow.bak') {
            setHistory(prev => [...prev, { text: 'Access denied: File encrypted under secondary root permissions.', type: 'error' }]);
          } else {
            setHistory(prev => [...prev, { text: `cat: ${args[1]}: No such file or directory`, type: 'error' }]);
          }
          break;

        case 'nmap':
          if (args[1] === '-sV' && args[2] === 'secureserver.local') {
            setHistory(prev => [
              ...prev,
              { text: 'Starting Nmap 7.92 ( https://nmap.org ) at 2026-05-25...', type: 'system' },
              { text: 'Nmap scan report for secureserver.local (10.0.88.54)', type: 'output' },
              { text: 'Host is up (0.0021s latency).', type: 'output' },
              { text: 'PORT     STATE SERVICE VERSION', type: 'system' },
              { text: '22/tcp   open  ssh     OpenSSH 8.2p1 (Protocol 2.0)', type: 'output' },
              { text: '80/tcp   open  http    Apache httpd 2.4.41 ((Ubuntu))', type: 'output' },
              { text: 'MAC Address: 02:42:AC:11:00:02 (Simulated Container)', type: 'output' },
              { text: 'Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel', type: 'output' },
              { text: 'Nmap done: 1 IP address scanned in 1.45 seconds', type: 'success' }
            ]);
          } else {
            setHistory(prev => [
              ...prev,
              { text: 'Syntax Error: To scan secureserver.local, use: nmap -sV secureserver.local', type: 'error' }
            ]);
          }
          break;

        case 'ssh':
          if (args[1] === 'admin@secureserver.local') {
            setSshStep('password');
            setHistory(prev => [
              ...prev,
              { text: 'Connecting to secureserver.local...', type: 'system' },
              { text: 'The authenticity of host secureserver.local cannot be established.', type: 'output' },
              { text: 'Warning: Permanently added secureserver.local to the list of known hosts.', type: 'output' },
              { text: 'admin@secureserver.local\'s password: ', type: 'system' }
            ]);
          } else {
            setHistory(prev => [
              ...prev,
              { text: 'SSH usage error: Try connecting with: ssh admin@secureserver.local', type: 'error' }
            ]);
          }
          break;

        default:
          setHistory(prev => [
            ...prev,
            { text: `bash: ${baseCommand}: command not found. Type "help" to list valid instructions.`, type: 'error' }
          ]);
      }
    } 
    // 2. REMOTE SSH CONTAINER SESSION COMMANDS
    else {
      switch (baseCommand) {
        case 'help':
          setHistory(prev => [
            ...prev,
            { text: 'Remote SecureServer Active. Commands available:', type: 'system' },
            { text: '  help                        Display remote help menu.', type: 'output' },
            { text: '  ls                          List root directories in Remote Server.', type: 'output' },
            { text: '  cat <file>                  Retrieve contents of file.', type: 'output' },
            { text: '  exit                        Terminate secure session and return to local sandbox.', type: 'output' }
          ]);
          break;

        case 'ls':
          setHistory(prev => [
            ...prev,
            { text: 'bin/     etc/     flag.txt     var/', type: 'output' }
          ]);
          break;

        case 'cat':
          if (args[1] === 'flag.txt') {
            setHistory(prev => [
              ...prev,
              { text: '⚡ HACKING MISSION SUCCESS! MISSION FLAG ACQUIRED:', type: 'success' },
              { text: 'flag{black_cypher_sandbox_authorized}', type: 'success' },
              { text: 'Copy this flag and submit it in your Hacking Mission Board on your dashboard for 500 XP!', type: 'system' }
            ]);
          } else if (args[1]) {
            setHistory(prev => [
              ...prev,
              { text: `cat: ${args[1]}: Permission Denied (Requires Level 2 clearances)`, type: 'error' }
            ]);
          } else {
            setHistory(prev => [...prev, { text: 'Usage: cat <filename>', type: 'error' }]);
          }
          break;

        case 'exit':
          setIsRemoteSession(false);
          setHistory(prev => [
            ...prev,
            { text: 'Connection to secureserver.local closed by foreign host.', type: 'system' },
            { text: 'Returned to local guest node terminal sandbox.', type: 'system' }
          ]);
          break;

        case 'clear':
          setHistory([]);
          break;

        default:
          setHistory(prev => [
            ...prev,
            { text: `bash: ${baseCommand}: command not found on remote secureserver.`, type: 'error' }
          ]);
      }
    }
  };

  const resetTerminal = () => {
    setIsRemoteSession(false);
    setSshStep('none');
    setHistory([
      { text: 'BLACK CYPHER SECURE SANDBOX TERMINAL v1.4.2-STABLE', type: 'system' },
      { text: 'Guest terminal container initialized successfully.', type: 'system' },
      { text: 'Type "help" to start.', type: 'system' }
    ]);
  };

  return (
    <Card variant="glass" className="border border-white/[0.06] bg-[#050814]/90 p-5 rounded-2xl relative shadow-glow-cyan/5">
      {/* HUD Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4 select-none">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-accent-cyan animate-pulse" />
          <span className="font-mono text-xs uppercase font-bold tracking-wider text-white">
            Sandbox terminal shell simulator
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] text-accent-cyan font-mono uppercase font-semibold">
            <Shield className="w-3 h-3" /> CTF Active
          </div>
          <button 
            onClick={resetTerminal}
            className="text-slate-400 hover:text-white hover:bg-white/[0.04] p-1.5 rounded transition-all"
            title="Reset Terminal Container"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Sandbox Directives */}
      <div className="mb-4 bg-accent-cyan/5 border border-accent-cyan/10 p-4 rounded-xl text-xs text-slate-300 font-sans leading-relaxed">
        <div className="flex gap-2 items-start">
          <AlertCircle className="w-4 h-4 text-accent-cyan shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Tactical Objective: Hack the local SecureServer</span>
            1. Open notes file using <code className="text-accent-cyan font-mono bg-cyan-500/10 px-1 py-0.5 rounded">cat notes.txt</code> to understand the briefing.<br/>
            2. Run network scanning tools, break into SSH session, and retrieve the flag inside <code className="text-accent-cyan font-mono bg-cyan-500/10 px-1 py-0.5 rounded">flag.txt</code>.<br/>
            3. Paste the flag on the dashboard Mission panel to redeem your XP bounty.
          </div>
        </div>
      </div>

      {/* Output Console Buffer */}
      <div className="h-80 overflow-y-auto font-mono text-[11px] leading-relaxed p-4 rounded-xl border border-white/[0.04] bg-[#020409] flex flex-col gap-1.5 select-text mb-4">
        {history.map((line, idx) => {
          let color = 'text-slate-300';
          if (line.type === 'input') color = 'text-white font-semibold';
          if (line.type === 'system') color = 'text-accent-cyan/80';
          if (line.type === 'error') color = 'text-red-400 font-bold';
          if (line.type === 'success') color = 'text-accent-emerald font-bold';

          return (
            <div key={idx} className={`${color} whitespace-pre-wrap`}>
              {line.text}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Prompt Form */}
      <form onSubmit={handleCommandSubmit} className="flex gap-2 items-center font-mono text-xs">
        <span className="text-accent-cyan shrink-0 select-none">
          {isRemoteSession ? 'admin@secureserver.local:~$ ' : 'guest@blackcypher-sandbox:~$ '}
        </span>
        <input
          type={sshStep === 'password' ? 'password' : 'text'}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={sshStep === 'password' ? 'Enter root password...' : 'Enter hacking shell command...'}
          className="flex-1 bg-[#020409] border border-white/[0.08] focus:border-accent-cyan rounded-lg px-3 py-2 text-white outline-none transition-all"
          autoFocus
        />
        <Button
          type="submit"
          variant="primary"
          glow="cyan"
          className="bg-accent-cyan text-black font-mono font-bold uppercase tracking-wider px-3 text-[10px]"
        >
          <Play className="w-3 h-3 shrink-0 mr-1" /> RUN
        </Button>
      </form>
    </Card>
  );
}

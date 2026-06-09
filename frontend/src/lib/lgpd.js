// LGPD masking utilities

export const maskEmail = (email) => {
  if (!email) return "";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
};

export const maskPhone = (phone) => {
  // Input expected: +55 (11) 97777-1234
  if (!phone) return "";
  return phone.replace(/(\d{4})$/, "****");
};

export const maskCPF = (cpf) => {
  if (!cpf) return "";
  // 123.456.789-00 -> ***.***.789-**
  const parts = cpf.split(/[.\-]/);
  if (parts.length < 4) return cpf;
  return `***.***.${parts[2]}-**`;
};

export const formatRelative = (date) => {
  const d = new Date(date);
  const diffMs = Date.now() - d.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

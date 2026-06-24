const RULE_LIST_NAME = "Real Fake Tickets — bidrag";

/**
 * Lägger till mailadressen som subscriber i Rule och taggar den med
 * kampanjlistan. Rule triggar automationen (autosvaret) på taggen.
 * Misslyckas tyst — ett Rule-strul ska inte blockera själva ansökan.
 */
export async function addToRuleList(email: string, name: string): Promise<void> {
  const apiKey = process.env.RULE_API_KEY;
  if (!apiKey) return;

  try {
    const res = await fetch("https://app.rule.io/api/v2/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        update_on_duplicate: true,
        tags: [RULE_LIST_NAME],
        subscribers: { email, name },
      }),
    });

    if (!res.ok) {
      console.error("Rule API-fel:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Kunde inte nå Rule:", err);
  }
}

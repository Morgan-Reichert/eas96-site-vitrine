/**
 * Trois dernières vidéos de la chaîne YouTube, lues côté serveur.
 *
 * La clé API reste ici : elle n'est jamais envoyée au navigateur, donc aucune
 * restriction de domaine n'est nécessaire. À renseigner dans Vercel, sur le projet
 * du site vitrine : Settings > Environment Variables.
 *   YOUTUBE_API_KEY      clé API YouTube Data v3
 *   YOUTUBE_CHANNEL_ID   identifiant de la chaîne (UC…), facultatif
 *
 * Sans clé, la route renvoie une liste vide et la page affiche son message d'attente.
 */
module.exports = async function handler(request, response) {
  const cle = process.env.YOUTUBE_API_KEY;
  const chaine = process.env.YOUTUBE_CHANNEL_ID || "UCB6fe2854SQuDLuTwbEz7WQ";

  // Réponse gardée en cache 15 minutes par Vercel : une poignée d'appels par jour
  response.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=3600");

  if (!cle) return response.status(200).json({ videos: [] });

  // Liste des mises en ligne de la chaîne : 1 unité de quota par appel, contre 100 pour une recherche
  const liste = "UU" + chaine.slice(2);
  const adresse =
    "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=3" +
    "&playlistId=" + encodeURIComponent(liste) +
    "&key=" + encodeURIComponent(cle);

  try {
    const reponse = await fetch(adresse);
    if (!reponse.ok) return response.status(200).json({ videos: [] });

    const donnees = await reponse.json();
    const videos = (donnees.items || [])
      .map((item) => ({
        id: item.snippet && item.snippet.resourceId && item.snippet.resourceId.videoId,
        title: item.snippet && item.snippet.title,
        date: item.snippet && item.snippet.publishedAt,
      }))
      .filter((video) => video.id);

    return response.status(200).json({ videos });
  } catch (erreur) {
    return response.status(200).json({ videos: [] });
  }
};

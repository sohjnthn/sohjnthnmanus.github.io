import { registerRootComponent } from 'expo';
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Image,
  Dimensions,
  Linking,
} from 'react-native';

const { width } = Dimensions.get('window');

const IMAGE_BASE_URL = 'https://sohjnthn.github.io/';
const img = (filename: string) => ({ uri: IMAGE_BASE_URL + filename });

type TipEntry = {
  keywords: string[];
  answer: string;
  images?: string[];
};

const tipsDatabase: TipEntry[] = [
  {
    keywords: ['early', 'meso', 'mesos', 'farming'],
    answer:
      'Early Mesos Farming:\n\nFocus on grinding at level range normal monster maps.\nSell Glowing Soul Crystals from expedition bosses to NPC Collector.\nSell disassembled equipment via the Maple Auction to other players for Mesos.',
    images: [
      'received_735084553007492.jpeg',
      'alchemy_extraction.jpg',
      'boss_mileage.jpg',
      'Maple_140626_155808.jpg',
    ],
  },
  {
    keywords: [
      'union',
      'maple union',
      'artifact',
      'union artifact',
      'artifact crystal',
      'maple union artifact crystal',
    ],
    answer:
      "Maple Union:\n\nPrioritise MATT/ATT according to your damage type.\nThen focus on Primary Stat, Secondary Stat, HP (about 40k buffed HP is required to tank Mechanical Haven's Remodeled Giant Android and Georgi), Critical Damage+%, Boss Damage+%, and Ignore DEF+%.",
    images: ['union_strategy.jpg', 'union_artifact.jpg'],
  },
  {
    keywords: ['bishop'],
    answer:
      'Bishop Tips:\n\nFocus on survivability.\nDo not use the 2nd job Heal skill, as this may cause the Bishop and any other party member(s) to die if affected by the Zombify abnormal status effect.',
    images: ['FB_IMG_1777005553625.jpg'],
  },
  {
    keywords: ['bossing', 'boss', 'expedition'],
    answer:
      'Bossing Progression:\n\nImprove Critical Damage+%, Boss Damage+%, and Ignore DEF+%, in this order.\n\nThe Ascent (second 6th job attack) skill clears many non-Chaos bosses efficiently after 6th job advancement.',
    images: [
      'FB_IMG_1775036218395.jpg',
      'Maple_100526_140123.jpg',
      'FB_IMG_1778924688621.jpg',
    ],
  },
  {
    keywords: ['link skills', 'link', 'links'],
    answer:
      'Essential Link Skills:\n\nKanna, Ark, Illium, Explorer Magicians, Hayato, Demon Avenger, Knights of Cygnus (excluding Mihile), Adele, Xenon, Khali, Lara, and Explorer Pirates.',
    images: ['Maple_210626_171336.jpg'],
  },
  {
    keywords: ['gear', 'equipment'],
    answer:
      'Efficient Gear Progression:\n\nProgress equipment using naturally obtained gear and boss drops.\n\nEarly: Fensalir equipment\nMid: Arcaneshade and Root Abyss\nLong-term: Gradual damage range improvements with related event items for untradable equipment, and Daily Gift Choice Cubes/Choice Additional Cubes for tradable equipment.',
    images: [
      'FB_IMG_1771654388149.jpg',
      'FB_IMG_1771654392720.jpg',
      'FB_IMG_1773890578891.jpg',
      'FB_IMG_1773890584328.jpg',
    ],
  },
  {
    keywords: [
      'main',
      'character',
      'main character',
      'unfunded',
      'progression',
      'unfunded progression',
      'unfunded main character progression',
    ],
    answer:
      'Only for the main character, purchase the cheapest clean (non-spell trace/star force/potential-enhanced, blue-text additional stats OK):\n\n1. lv200 Arcaneshade hat, shoes, gloves, cape, shoulder\n2. lv150 Root Abyss top and bottom\n\nEnhance untradable equipment with event items: Unique (Normal) Potential scroll (100% pass), 20-or-fewer-star scroll up to lv160 (100% pass), Karma Black Resurrection Flames, Karma Choice Cubes, Karma Choice Additional Cubes.\n\nAny remaining untradable equipment can use Daily Gift Choice Cubes and Choice Additional Cubes.',
    images: ['FB_IMG_1771654388149.jpg'],
  },
  {
    keywords: ['guild'],
    answer:
      'Create your own guild if you have not done so, preferably with the main character as the guild leader, and non-main characters on the same server/account.',
    images: [
      'FB_IMG_1780753665903.jpg',
      'FB_IMG_1780753736858.jpg',
      'FB_IMG_1780753739152.jpg',
    ],
  },
];

function findBotReply(message: string): { answer: string; images: string[] } {
  const lower = message.toLowerCase();
  for (const item of tipsDatabase) {
    for (const keyword of item.keywords) {
      if (lower.includes(keyword)) {
        return { answer: item.answer, images: item.images ?? [] };
      }
    }
  }
  return {
    answer:
      'I could not find a matching answer yet. Try: mesos, union, bossing, bishop, gear, link skills, guild.',
    images: [],
  };
}

type ChatMessage = { id: string; sender: 'user' | 'bot'; text: string; images?: string[] };

const INITIAL_BOT_MESSAGE: ChatMessage = {
  id: 'intro',
  sender: 'bot',
  text: 'Hello! Ask me about Mesos farming, progression, Maple Union, defeating expedition boss monsters, equipment for the main character, link skills, and more.',
};

function TipsSearchAndChat() {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<TipEntry[] | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [chatInput, setChatInput] = useState('');

  const runSearch = () => {
    const query = searchInput.toLowerCase().trim();
    if (query === '') {
      setSearchResults(null);
      return;
    }
    const matches = tipsDatabase.filter((item) =>
      item.keywords.some((keyword) => query.includes(keyword))
    );
    setSearchResults(matches);
  };

  const sendMessage = () => {
    const message = chatInput.trim();
    if (message === '') return;

    const { answer, images } = findBotReply(message);
    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: message },
      { id: `b-${Date.now() + 1}`, sender: 'bot', text: answer, images },
    ]);
    setChatInput('');
  };

  return (
    <View style={styles.componentWrapper}>
      <Text style={styles.subTitle}>Search the Tips</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search MapleStorySEA tips..."
          placeholderTextColor="#888"
          value={searchInput}
          onChangeText={setSearchInput}
          onSubmitEditing={runSearch}
          returnKeyType="search"
        />
        <TouchableOpacity style={styles.searchButton} onPress={runSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {searchResults !== null && (
        <View style={styles.searchResults}>
          {searchResults.length === 0 ? (
            <View style={styles.searchResultCard}>
              <Text style={styles.tierText}>
                No matching tips found.{'\n\n'}Try searching for: mesos, union, bossing, bishop, gear, link skills
              </Text>
            </View>
          ) : (
            searchResults.map((item, idx) => (
              <View key={idx} style={styles.searchResultCard}>
                <Text style={styles.tierText}>{item.answer}</Text>
                {!!item.images?.length && (
                  <View style={styles.imagesRow}>
                    {item.images.map((filename, i) => (
                      <Image key={i} source={img(filename)} style={styles.searchResultImage} />
                    ))}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      )}

      <Text style={styles.subTitle}>Tips Assistant</Text>
      <View style={styles.chatbotContainer}>
        <View style={styles.chatbotHeader}>
          <Text style={styles.chatbotHeaderText}>MapleStorySEA Tips Assistant</Text>
        </View>
        <View style={styles.chatMessagesList}>
          {chatMessages.map((msg) => (
            <View
              key={msg.id}
              style={[
                styles.messageBubble,
                msg.sender === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{msg.text}</Text>
              {!!msg.images?.length && (
                <View style={styles.imagesRow}>
                  {msg.images.map((filename, i) => (
                    <Image key={i} source={img(filename)} style={styles.chatImage} />
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>
        <View style={styles.chatInputArea}>
          <TextInput
            style={styles.chatInput}
            placeholder="Ask a question..."
            placeholderTextColor="#888"
            value={chatInput}
            onChangeText={setChatInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_BOT_MESSAGE]);
  const [input, setInput] = useState('');

  const sendFloatingMessage = () => {
    const message = input.trim();
    if (message === '') return;

    const { answer, images } = findBotReply(message);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: message },
      { id: `b-${Date.now() + 1}`, sender: 'bot', text: answer, images },
    ]);
    setInput('');
  };

  return (
    <>
      {open && (
        <View style={styles.floatingChatBox}>
          <View style={styles.floatingChatHeader}>
            <Text style={styles.floatingChatHeaderText}>Tips Assistant (Floating View)</Text>
            <TouchableOpacity onPress={() => setOpen(false)}>
              <Text style={styles.floatingChatClose}>✕</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.floatingChatMessages}>
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userMessage : styles.botMessage,
                ]}
              >
                <Text style={styles.messageText}>{msg.text}</Text>
                {!!msg.images?.length && (
                  <View style={styles.imagesRow}>
                    {msg.images.map((filename, i) => (
                      <Image key={i} source={img(filename)} style={styles.chatImage} />
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          <View style={styles.chatInputArea}>
            <TextInput
              style={styles.chatInput}
              placeholder="Ask a question..."
              placeholderTextColor="#888"
              value={input}
              onChangeText={setInput}
              onSubmitEditing={sendFloatingMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendFloatingMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.floatingToggle} onPress={() => setOpen((v) => !v)}>
        <Text style={styles.floatingToggleText}>💬</Text>
      </TouchableOpacity>
    </>
  );
}

const YOUTUBE_IDS = ['wZiIDkbclDU', 'oRqOKkCFuK4', '2vl-uhVJIZ4'];

function YouTubeVideos() {
  const openYouTubeVideo = (id: string) => {
    Linking.openURL(`https://www.youtube.com/watch?v=${id}`).catch(() => {});
  };

  return (
    <View style={styles.youtubeWrapper}>
      {YOUTUBE_IDS.map((id, index) => (
        <TouchableOpacity
          key={id}
          style={styles.youtubeCard}
          onPress={() => openYouTubeVideo(id)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: `https://img.youtube.com/vi/${id}/hqdefault.jpg` }}
            style={styles.youtubeThumbnail}
          />
          <View style={styles.playOverlay}>
            <Text style={styles.playButtonIcon}>▶</Text>
            <Text style={styles.playButtonText}>Watch Guide #{index + 1} on YouTube</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

function MapleStorySEATipsApp() {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'mesos', label: 'Mesos' },
    { id: 'progression', label: 'Gear' },
    { id: 'bossing', label: 'Bossing' },
    { id: 'strategies', label: 'Strategies' },
  ];

  const renderOverview = () => (
    <ScrollView style={styles.section} contentContainerStyle={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Welcome to Unfunded Gameplay</Text>
      <Text style={styles.bodyText}>
        Learn how to progress in MapleStorySEA without using Cash Shop purchases. This guide focuses on Mesos-only gameplay.
      </Text>

      <Text style={styles.subTitle}>Quick Start</Text>
      <Text style={styles.bodyText}>
        Reaching level 11 for both Authentic Symbols (Cernium and Arcs) should provide enough clean damage range to defeat:
      </Text>
      {[
        'Normal Papulatus',
        'Normal Arkarium',
        'Normal Magnus',
        'Hard Von Leon',
        'Normal Pink Bean',
        'Normal Kawoong',
        'Hard Hilla',
        'Normal Cygnus',
      ].map((boss, idx) => (
        <Text key={idx} style={styles.listItem}>
          • {boss}
        </Text>
      ))}

      <Text style={styles.subTitle}>Core Philosophy</Text>
      <Text style={[styles.bodyText, styles.highlight]}>
        "Steady beats fast" — Consistent daily routines outperform shortcuts.
      </Text>
    </ScrollView>
  );

  const renderMesos = () => (
    <ScrollView style={styles.section} contentContainerStyle={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Mesos Earning Methods</Text>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Ardentmill Extraction</Text>
        <Text style={styles.tierText}>
          Extract unused equipment via Alchemy to get item crystals. These crystals have value in the Maple Auction.
        </Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Daily Bossing</Text>
        <Text style={styles.tierText}>
          Defeat daily bosses to collect Glowing Soul Crystals. Sell these directly to the NPC Collector in Ardentmill.
        </Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Maple Auction</Text>
        <Text style={styles.tierText}>
          Sell item crystals and leftover materials for steady Mesos. Check market prices before listing.
        </Text>
      </View>

      <View style={styles.imagesRow}>
        <Image source={img('received_735084553007492.jpeg')} style={styles.sectionImage} />
        <Image source={img('alchemy_extraction.jpg')} style={styles.sectionImage} />
        <Image source={img('boss_mileage.jpg')} style={styles.sectionImage} />
        <Image source={img('Maple_140626_155808.jpg')} style={styles.sectionImage} />
      </View>

      <Text style={styles.subTitle}>Recommended Routine</Text>
      {[
        'Train on level-appropriate maps',
        'Extract all unused equipment',
        'Complete daily bosses',
        'Sell materials and crystals',
        'Repeat consistently',
      ].map((step, idx) => (
        <Text key={idx} style={styles.listItem}>
          {idx + 1}. {step}
        </Text>
      ))}

      <TipsSearchAndChat />
    </ScrollView>
  );

  const renderProgression = () => (
    <ScrollView style={styles.section} contentContainerStyle={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Gear Progression Path</Text>

      <Text style={styles.subTitle}>Account-Wide Layers</Text>
      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Maple Union</Text>
        <Text style={styles.tierText}>
          Free system that boosts all characters on your account. Essential for damage range.
        </Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Link Skills</Text>
        <Text style={styles.tierText}>
          Permanent account-wide buffs from different characters. These compound with all upgrades.
        </Text>
      </View>

      <Text style={styles.subTitle}>Main Character Equipment</Text>
      {[
        { stage: 'Early', equipment: 'Fensalir equipment from drops', level: '-' },
        { stage: 'Mid-Term', equipment: 'Root Abyss (Top & Bottom)', level: '150' },
        { stage: 'Mid-Term', equipment: 'Arcaneshade (Hat, Shoes, Gloves, Cape, Shoulder)', level: '200' },
        { stage: 'Long-Term', equipment: 'Gradual Mesos-funded upgrades', level: '-' },
      ].map((item, idx) => (
        <View key={idx} style={styles.tableRow}>
          <Text style={styles.tableCell}>{item.stage}</Text>
          <Text style={styles.tableCell}>{item.equipment}</Text>
          <Text style={styles.tableCell}>{item.level}</Text>
        </View>
      ))}

      <View style={styles.imagesRow}>
        <Image source={img('FB_IMG_1771654388149.jpg')} style={styles.sectionImage} />
        <Image source={img('FB_IMG_1771654392720.jpg')} style={styles.sectionImage} />
        <Image source={img('FB_IMG_1773890578891.jpg')} style={styles.sectionImage} />
        <Image source={img('FB_IMG_1773890584328.jpg')} style={styles.sectionImage} />
      </View>

      <Text style={styles.subTitle}>Accessory Sets</Text>
      {['Level 140 Sengoku Era 2 3-Accessory Set'].map((set, idx) => (
        <Text key={idx} style={styles.listItem}>
          • {set}
        </Text>
      ))}

      <TipsSearchAndChat />
    </ScrollView>
  );

  const renderBossing = () => (
    <ScrollView style={styles.section} contentContainerStyle={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Bossing Guide by Damage Range</Text>
      <Text style={styles.bodyText}>
        Progress through bosses as your damage range increases. Prioritize routine completion over difficulty.
      </Text>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Tier 1: Entry Level</Text>
        <Text style={styles.tierText}>Damage: 0.6m – 1.0m clean damage range | Boss: Normal Zakum</Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Tier 2: Early Expedition</Text>
        <Text style={styles.tierText}>Damage: 2.0m+ lower clean damage range | Bosses: Normal Hilla, Normal Ranmaru, Normal Horntail</Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Tier 3: Pre-6th Job</Text>
        <Text style={styles.tierText}>Damage: 19.5m+ lower clean damage range | Bosses: Normal Vellum/Crimson Queen/Pierre/Von Bon</Text>
      </View>

      <View style={styles.tierBox}>
        <Text style={styles.tierTitle}>Tier 4: Weekly Roster (Post-6th Job)</Text>
        <Text style={styles.tierText}>Damage: 19.5m+ lower clean damage range with full 5th/6th job | Hard/Normal Von Leon, Normal/Easy Arkarium, Chaos Horntail, Normal Kawoong, Hard Ranmaru, Chaos/Normal Papulatus, Chaos/Normal Pink Bean, Hard/Normal Magnus, Normal/Easy Cygnus, Hard Hilla, Chaos Vellum/Crimson Queen/Pierre/Von Bon, Normal Princess Nou, and Normal Akechi Mitsuhide</Text>
      </View>

      <View style={styles.imagesRow}>
        <Image source={img('FB_IMG_1775036218395.jpg')} style={styles.sectionImage} />
        <Image source={img('Maple_100526_140123.jpg')} style={styles.sectionImage} />
        <Image source={img('Maple_110526_005124.jpg')} style={styles.sectionImage} />
        <Image source={img('FB_IMG_1778924688621.jpg')} style={styles.sectionImage} />
        <Image source={img('FB_IMG_1777005553625.jpg')} style={styles.sectionImage} />
      </View>

      <TipsSearchAndChat />
    </ScrollView>
  );

  const renderStrategies = () => (
    <ScrollView style={styles.section} contentContainerStyle={styles.sectionContent}>
      <Text style={styles.sectionTitle}>Key Strategies for Success</Text>

      {[
        {
          title: 'Steady Beats Fast',
          text: 'Consistent daily routines outperform shortcuts. Regular farming and checking prices builds wealth faster.',
        },
        {
          title: 'Focus on Clean Damage Range',
          text: 'Your clean damage range determines which bosses you can defeat. Prioritize reaching the next threshold.',
        },
        {
          title: 'Permanent Content is Your Friend',
          text: 'Use permanent content accessory sets (such as Sengoku) for early damage boosts. These are always available.',
        },
        {
          title: 'Authentic Symbols Matter',
          text: 'Focus on leveling Authentic Symbols for Cernium and Arcs to level 11 for significant damage boost.',
        },
        {
          title: 'Account-Wide Systems Compound',
          text: "Maple Union and Link Skills strengthen every character. They're free, permanent, and compound.",
        },
        {
          title: 'Lower-Tier Bosses Still Pay Out',
          text: "Don't skip lower-tier bosses. They provide reliable Mesos and help build your routine.",
        },
      ].map((strategy, idx) => (
        <View key={idx} style={styles.strategyBox}>
          <Text style={styles.strategyTitle}>{strategy.title}</Text>
          <Text style={styles.strategyText}>{strategy.text}</Text>
        </View>
      ))}

      <Text style={styles.subTitle}>Video Guides</Text>
      <YouTubeVideos />

      <TipsSearchAndChat />
    </ScrollView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'mesos':
        return renderMesos();
      case 'progression':
        return renderProgression();
      case 'bossing':
        return renderBossing();
      case 'strategies':
        return renderStrategies();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>MapleStorySEA</Text>
        <Text style={styles.headerSubtitle}>Unfunded Player Tips</Text>
      </View>

      <View style={styles.tabContainerWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabContainer}
          contentContainerStyle={styles.tabContent}
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mainBody}>{renderContent()}</View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MapleStorySEA Unfunded Tips | Mesos-only Gameplay</Text>
      </View>

      <FloatingChatbot />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1e3c72',
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e0e0',
    marginTop: 5,
  },
  tabContainerWrapper: {
    maxHeight: 55,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tabContainer: {
    backgroundColor: '#fff',
  },
  tabContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  tab: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  mainBody: {
    flex: 1,
  },
  section: {
    flex: 1,
  },
  sectionContent: {
    padding: 15,
    paddingBottom: 30,
  },
  componentWrapper: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e3c72',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#667eea',
    paddingBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a5298',
    marginTop: 15,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  highlight: {
    backgroundColor: '#fff3cd',
    padding: 10,
    borderRadius: 5,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  listItem: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    marginVertical: 5,
    lineHeight: 18,
  },
  tierBox: {
    backgroundColor: '#f0f4ff',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
  },
  tierTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  tierText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  tableRow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 3,
  },
  tableCell: {
    fontSize: 13,
    color: '#333',
    marginVertical: 2,
  },
  strategyBox: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    padding: 12,
    marginVertical: 10,
    borderRadius: 5,
  },
  strategyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 5,
  },
  strategyText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  imagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 12,
  },
  sectionImage: {
    width: (width - 15 * 2 - 10) / 2,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
  },
  youtubeWrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
  youtubeCard: {
    width: '100%',
    height: 190,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#000',
    position: 'relative',
  },
  youtubeThumbnail: {
    width: '100%',
    height: '100%',
    opacity: 0.85,
  },
  playOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButtonIcon: {
    color: '#ff0000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  playButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
  },
  searchButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  searchResults: {
    marginBottom: 15,
  },
  searchResultCard: {
    backgroundColor: '#f8f9fa',
    borderLeftWidth: 4,
    borderLeftColor: '#667eea',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  searchResultImage: {
    width: 90,
    height: 70,
    borderRadius: 6,
    marginRight: 8,
    marginTop: 8,
    backgroundColor: '#e0e0e0',
  },
  chatbotContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    marginBottom: 20,
  },
  chatbotHeader: {
    backgroundColor: '#f0f4ff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  chatbotHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2a5298',
  },
  chatMessagesList: {
    backgroundColor: '#f7f7f7',
    padding: 12,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '85%',
  },
  botMessage: {
    backgroundColor: '#e6f0ff',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: '#d9ffe0',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  chatImage: {
    width: 70,
    height: 55,
    borderRadius: 6,
    marginRight: 6,
    marginTop: 6,
    backgroundColor: '#e0e0e0',
  },
  chatInputArea: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  chatInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
  },
  sendButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  floatingToggle: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  floatingToggleText: {
    fontSize: 26,
  },
  floatingChatBox: {
    position: 'absolute',
    bottom: 95,
    right: 20,
    width: Math.min(340, width - 40),
    height: 440,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  floatingChatHeader: {
    backgroundColor: '#667eea',
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  floatingChatHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  floatingChatClose: {
    color: '#fff',
    fontSize: 18,
  },
  floatingChatMessages: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 12,
  },
});

class SafeErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.toString() };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('Unhandled UI Exception caught gracefully:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#d9534f', marginBottom: 10 }}>
            Application Encountered an Issue
          </Text>
          <Text style={{ fontSize: 13, color: '#666', textAlign: 'center', marginBottom: 20 }}>
            {this.state.error}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#667eea', padding: 12, borderRadius: 8 }}
            onPress={() => this.setState({ hasError: false })}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Reload Screen</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  return (
    <SafeErrorBoundary>
      <MapleStorySEATipsApp />
    </SafeErrorBoundary>
  );
}

registerRootComponent(App);
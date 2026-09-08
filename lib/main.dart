import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:hugeicons/hugeicons.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

void main() {
  runApp(const TradingJournalApp());
}

class TradingJournalApp extends StatelessWidget {
  const TradingJournalApp({super.key});

  @override
  Widget build(BuildContext context) {
    // ShadApp wraps the material app to inject Shadcn's dark design system globally
    return ShadApp.custom(
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
      darkTheme: ShadThemeData(
        brightness: Brightness.dark,
        colorScheme: const ShadSlateColorScheme.dark(),
      ),
      appBuilder: (context, theme) {
        return const MaterialApp(
          debugShowCheckedModeBanner: false,
          home: DashboardScreen(),
        );
      },
    );
  }
}

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0A),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        toolbarHeight: 60,
        leadingWidth: 64,
        // Mobile Professional Standard: 48px touch targets
        leading: Padding(
          padding: const EdgeInsets.only(left: 8.0),
          child: IconButton(
            icon: const HugeIcon(
              icon: HugeIcons.strokeRoundedMenu01,
              color: Colors.white,
              size: 24.0,
            ),
            splashRadius: 24,
            onPressed: () {},
          ),
        ),
        title: Text(
          'Dashboard',
          style: GoogleFonts.interTight(
            fontSize: 17.0,
            color: Colors.white,
            fontWeight: FontWeight.w500, // Medium
            letterSpacing: -0.41,
          ),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 20.0),
            child: Center(
              child: Container(
                height: 40,
                width: 40,
                decoration: BoxDecoration(
                  color: const Color(0xFF1A1A1A),
                  borderRadius: BorderRadius.circular(10.0),
                ),
                child: IconButton(
                  padding: EdgeInsets.zero,
                  icon: const HugeIcon(
                    icon: HugeIcons.strokeRoundedDollarSquare,
                    color: Colors.white,
                    size: 22.0,
                  ),
                  splashRadius: 20,
                  onPressed: () {},
                ),
              ),
            ),
          ),
        ],
      ),
      body: Padding(
        // Mobile Professional Standard: 20px horizontal gutters
        padding: const EdgeInsets.symmetric(horizontal: 20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 24.0),
            Text(
              'Welcome back, cow',
              style: GoogleFonts.interTight(
                fontSize: 26.0,
                fontWeight: FontWeight.w500, // Medium
                color: Colors.white,
                letterSpacing: -0.5,
              ),
            ),
            const SizedBox(height: 6.0),
            Text(
              'Tue 08 Sep, 2026',
              style: GoogleFonts.interTight(
                fontSize: 15.0,
                fontWeight: FontWeight.w400, // Regular
                color: const Color(0xFFA3A3A3), // Neutral gray
              ),
            ),
          ],
        ),
      ),
      // Floating Plus Button with native glassmorphism
      floatingActionButton: ClipRRect(
        borderRadius: BorderRadius.circular(50.0),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 12.0, sigmaY: 12.0),
          child: Container(
            height: 56.0,
            width: 56.0,
            decoration: BoxDecoration(
              color: Colors.greenAccent.withOpacity(0.15),
              shape: BoxShape.circle,
              border: Border.all(
                color: Colors.greenAccent.withOpacity(0.25),
                width: 1.0,
              ),
            ),
            child: IconButton(
              padding: EdgeInsets.zero,
              icon: const HugeIcon(
                icon: HugeIcons.strokeRoundedAdd01,
                color: Colors.greenAccent,
                size: 28.0,
              ),
              onPressed: () {},
            ),
          ),
        ),
      ),
    );
  }
}
